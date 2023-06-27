import prisma from 'libs/prisma';

import ModelError from 'errors/ModelError';

const ACHIEVEMENT_FIND_ALL_REL_USER_QUERY_OBJ = { id: true, regNumber: true, name: true };
const ACHIEVEMENT_FIND_ONE_REL_USER_QUERY_OBJ = {
  id: true,
  regNumber: true,
  name: true,
  avatarUrl: true,
};

export async function findAll(filters = {}, errorOptions = {}) {
  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        ...('tags' in filters ? { tags: { hasEvery: filters.tags } } : {}),
      },
      include: {
        category: true,
        from: { select: ACHIEVEMENT_FIND_ALL_REL_USER_QUERY_OBJ },
        to: { select: ACHIEVEMENT_FIND_ALL_REL_USER_QUERY_OBJ },
      },
    });

    return achievements;
  } catch (err) {
    throw new ModelError('Something went wrong', 500, {
      ...errorOptions,
      type: 'fetch',
    });
  }
}

export async function findByAchievementId(achievementId, errorOptions = {}) {
  try {
    const achievement = await prisma.achievement.findFirstOrThrow({
      where: { id: achievementId },
      include: {
        category: true,
        from: { select: ACHIEVEMENT_FIND_ALL_REL_USER_QUERY_OBJ },
        to: { select: ACHIEVEMENT_FIND_ONE_REL_USER_QUERY_OBJ },
      },
    });

    return achievement;
  } catch {
    throw new ModelError('No achievement was found with the id provided', 404, {
      ...errorOptions,
      path: 'achievementId',
    });
  }
}

export async function create(fromId, toId, newAchievement, errorOptions = {}) {
  try {
    await prisma.$transaction([
      prisma.achievement.create({
        data: {
          title: newAchievement.title,
          description: newAchievement.description,
          points: newAchievement.points,
          tags: newAchievement.tags,
          from: { connect: { id: fromId } },
          to: { connect: { id: toId } },
          category: {
            ...('categoryId' in newAchievement
              ? { connect: { id: newAchievement.categoryId } }
              : { create: newAchievement.newCategory }),
          },
        },
      }),
      prisma.user.update({
        data: {
          obtainedAchievementPoints: { increment: newAchievement.points },
        },
        where: { id: toId },
      }),
    ]);

    return true;
  } catch (err) {
    console.log(err);
    throw new ModelError('Something went wrong while creating new achievement', 500, {
      ...errorOptions,
      type: 'create',
    });
  }
}

export async function updateByAchievementId(
  achievementId,
  updatedAchievement = {},
  errorOptions = {},
) {
  try {
    const oldAchievementData = await prisma.achievement.findFirstOrThrow({
      where: { id: achievementId },
      select: { toId: true, points: true },
    });

    const achievementUpdatedData = {};
    const achievementUpdatedPoints = oldAchievementData.points - (updatedAchievement.points ?? 0);

    ['categoryId', 'toId', 'title', 'description', 'points', 'tags'].forEach((col) => {
      if (col in updatedAchievement) {
        achievementUpdatedData[col] = updatedAchievement[col];
      }
    });

    if (!('categoryId' in updatedAchievement) && 'newCategory' in updatedAchievement) {
      const newCategory = await prisma.category.create({
        data: updatedAchievement.newCategory,
        select: { id: true },
      });

      achievementUpdatedData['categoryId'] = newCategory.id;
    }

    achievementUpdatedData['updatedAt'] = new Date();

    await prisma.$transaction([
      prisma.achievement.update({
        data: achievementUpdatedData,
        where: { id: achievementId },
      }),
      ...(updatedAchievement.toId && updatedAchievement.toId !== oldAchievementData.toId
        ? [
            prisma.user.update({
              data: { obtainedAchievementPoints: { decrement: oldAchievementData.points } },
              where: { id: oldAchievementData.toId },
            }), // remove the old points from the old user
            prisma.user.update({
              data: {
                obtainedAchievementPoints: {
                  increment: updatedAchievement.points ?? oldAchievementData.points,
                },
              },
              where: { id: updatedAchievement.toId },
            }), // add the new updated points to the new user
          ]
        : [
            prisma.user.update({
              data: { obtainedAchievementPoints: { decrement: achievementUpdatedPoints } },
              where: { id: oldAchievementData.toId },
            }),
          ]),
    ]);

    return true;
  } catch {
    throw new ModelError(`Something went wrong while updating achievement #${achievementId}`, 500, {
      ...errorOptions,
      type: 'update',
    });
  }
}

export async function deleteByAchievementId(achievementId, errorOptions = {}) {
  try {
    const deletedAchievement = await prisma.achievement.delete({
      where: { id: achievementId },
    });

    await prisma.user.update({
      data: { obtainedAchievementPoints: { decrement: deletedAchievement.points } },
      where: { id: deletedAchievement.toId },
    });

    return true;
  } catch {
    throw new ModelError(`Something went wrong while updating achievement #${achievementId}`, 500, {
      ...errorOptions,
      type: 'delete',
    });
  }
}
