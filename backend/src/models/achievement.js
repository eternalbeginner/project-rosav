import prisma from 'libs/prisma';

import ModelError from 'errors/ModelError';

export async function findAll(filters = {}, errorOptions = {}) {
  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        ...('tags' in filters ? { tags: { hasEvery: filters.tags } } : {}),
      },
      include: {
        category: true,
        from: { select: { id: true, regNumber: true, name: true } },
        to: { select: { id: true, regNumber: true, name: true } },
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
        from: { select: { id: true, regNumber: true, name: true, avatarUrl: true } },
        to: { select: { id: true, regNumber: true, name: true, avatarUrl: true } },
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
    await prisma.achievement.create({
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
    });

    return true;
  } catch {
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
    const achievementUpdatedData = {};

    if ('title' in updatedAchievement) {
      achievementUpdatedData['title'] = updatedAchievement.title;
    }

    if ('description' in updatedAchievement) {
      achievementUpdatedData['description'] = updatedAchievement.description;
    }

    if ('points' in updatedAchievement) {
      achievementUpdatedData['points'] = updatedAchievement.points;
    }

    if ('tags' in updatedAchievement) {
      achievementUpdatedData['tags'] = updatedAchievement.tags;
    }

    if ('toId' in updatedAchievement) {
      achievementUpdatedData['to'] = { connect: { id: updatedAchievement.toId } };
    }

    if ('categoryId' in updatedAchievement || 'newCategory' in updatedAchievement) {
      achievementUpdatedData['category'] = {};

      if ('categoryId' in updatedAchievement)
        achievementUpdatedData['category']['connect'] = { id: updatedAchievement.categoryId };
      else achievementUpdatedData['category']['create'] = updatedAchievement.newCategory;
    }

    achievementUpdatedData['updatedAt'] = new Date();

    await prisma.achievement.update({
      data: achievementUpdatedData,
      where: { id: achievementId },
    });

    return true;
  } catch (err) {
    console.error(err);
    throw new ModelError(`Something went wrong while updating achievement #${achievementId}`, 500, {
      ...errorOptions,
      type: 'update',
    });
  }
}

export async function deleteByAchievementId(achievementId, errorOptions = {}) {
  try {
    await prisma.achievement.delete({
      where: { id: achievementId },
    });

    return true;
  } catch {
    throw new ModelError(`Something went wrong while updating achievement #${achievementId}`, 500, {
      ...errorOptions,
      type: 'delete',
    });
  }
}
