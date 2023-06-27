import prisma from 'libs/prisma';

import ModelError from 'errors/ModelError';

const VIOLATION_FIND_ALL_REL_USER_QUERY_OBJ = { id: true, regNumber: true, name: true };
const VIOLATION_FIND_ONE_REL_USER_QUERY_OBJ = {
  id: true,
  regNumber: true,
  name: true,
  avatarUrl: true,
};

export async function findAll(filters = {}, errorOptions = {}) {
  try {
    const violations = await prisma.violation.findMany({
      where: {
        ...('tags' in filters ? { tags: { hasEvery: filters.tags } } : {}),
      },
      include: {
        category: true,
        from: { select: VIOLATION_FIND_ALL_REL_USER_QUERY_OBJ },
        to: { select: VIOLATION_FIND_ALL_REL_USER_QUERY_OBJ },
      },
    });

    return violations;
  } catch (err) {
    throw new ModelError('Something went wrong', 500, {
      ...errorOptions,
      type: 'fetch',
    });
  }
}

export async function findByViolationId(violationId, errorOptions = {}) {
  try {
    const violation = await prisma.violation.findFirstOrThrow({
      where: { id: violationId },
      include: {
        category: true,
        from: { select: VIOLATION_FIND_ALL_REL_USER_QUERY_OBJ },
        to: { select: VIOLATION_FIND_ONE_REL_USER_QUERY_OBJ },
      },
    });

    return violation;
  } catch {
    throw new ModelError('No  violation was found with the id provided', 404, {
      ...errorOptions,
      path: ' violationId',
    });
  }
}

export async function create(fromId, toId, newViolation, errorOptions = {}) {
  try {
    await prisma.$transaction([
      prisma.violation.create({
        data: {
          title: newViolation.title,
          description: newViolation.description,
          points: newViolation.points,
          tags: newViolation.tags,
          from: { connect: { id: fromId } },
          to: { connect: { id: toId } },
          category: {
            ...('categoryId' in newViolation
              ? { connect: { id: newViolation.categoryId } }
              : { create: newViolation.newCategory }),
          },
        },
      }),
      prisma.user.update({
        data: {
          obtainedViolationPoints: { increment: newViolation.points },
        },
        where: { id: toId },
      }),
    ]);

    return true;
  } catch {
    throw new ModelError('Something went wrong while creating new  violation', 500, {
      ...errorOptions,
      type: 'create',
    });
  }
}

export async function updateByViolationId(violationId, updatedViolation = {}, errorOptions = {}) {
  try {
    const oldViolationData = await prisma.violation.findFirstOrThrow({
      where: { id: violationId },
      select: { toId: true, points: true },
    });

    const violationUpdatedData = {};
    const violationUpdatedPoints = oldViolationData.points - (updatedViolation.points ?? 0);

    ['categoryId', 'toId', 'title', 'description', 'points', 'tags'].forEach((col) => {
      if (col in updatedViolation) {
        violationUpdatedData[col] = updatedViolation[col];
      }
    });

    if (!('categoryId' in updatedViolation) && 'newCategory' in updatedViolation) {
      const newCategory = await prisma.category.create({
        data: updatedViolation.newCategory,
        select: { id: true },
      });

      violationUpdatedData['categoryId'] = newCategory.id;
    }

    violationUpdatedData['updatedAt'] = new Date();

    await prisma.$transaction([
      prisma.violation.update({
        data: violationUpdatedData,
        where: { id: violationId },
      }),
      ...(updatedViolation.toId && updatedViolation.toId !== oldViolationData.toId
        ? [
            prisma.user.update({
              data: { obtainedViolationPoints: { decrement: oldViolationData.points } },
              where: { id: oldViolationData.toId },
            }), // remove the old points from the old user
            prisma.user.update({
              data: {
                obtainedViolationPoints: {
                  increment: updatedViolation.points ?? oldViolationData.points,
                },
              },
              where: { id: updatedViolation.toId },
            }), // add the new updated points to the new user
          ]
        : [
            prisma.user.update({
              data: { obtainedViolationPoints: { decrement: violationUpdatedPoints } },
              where: { id: oldViolationData.toId },
            }),
          ]),
    ]);

    return true;
  } catch (err) {
    console.error(err);
    throw new ModelError(`Something went wrong while updating  violation #${violationId}`, 500, {
      ...errorOptions,
      type: 'update',
    });
  }
}

export async function deleteByViolationId(violationId, errorOptions = {}) {
  try {
    const deletedViolation = await prisma.violation.delete({
      where: { id: violationId },
    });

    await prisma.user.update({
      data: { obtainedViolationPoints: { decrement: deletedViolation.points } },
      where: { id: deletedViolation.toId },
    });

    return true;
  } catch {
    throw new ModelError(`Something went wrong while updating  violation #${violationId}`, 500, {
      ...errorOptions,
      type: 'delete',
    });
  }
}
