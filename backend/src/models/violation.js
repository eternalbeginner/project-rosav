import prisma from 'libs/prisma';

import ModelError from 'errors/ModelError';

export async function findAll(filters = {}, errorOptions = {}) {
  try {
    const violations = await prisma.violation.findMany({
      where: {
        ...('tags' in filters ? { tags: { hasEvery: filters.tags } } : {}),
      },
      include: {
        category: true,
        from: { select: { id: true, regNumber: true, name: true } },
        to: { select: { id: true, regNumber: true, name: true } },
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
        from: { select: { id: true, regNumber: true, name: true, avatarUrl: true } },
        to: { select: { id: true, regNumber: true, name: true, avatarUrl: true } },
      },
    });

    return violation;
  } catch {
    throw new ModelError('No violation was found with the id provided', 404, {
      ...errorOptions,
      path: 'violationId',
    });
  }
}

export async function create(fromId, toId, newViolation, errorOptions = {}) {
  try {
    await prisma.violation.create({
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
    });

    return true;
  } catch {
    throw new ModelError('Something went wrong while creating new violation', 500, {
      ...errorOptions,
      type: 'create',
    });
  }
}

export async function updateByViolationId(violationId, updatedViolation = {}, errorOptions = {}) {
  try {
    const violationUpdatedData = {};

    if ('title' in updatedViolation) {
      violationUpdatedData['title'] = updatedViolation.title;
    }

    if ('description' in updatedViolation) {
      violationUpdatedData['description'] = updatedViolation.description;
    }

    if ('points' in updatedViolation) {
      violationUpdatedData['points'] = updatedViolation.points;
    }

    if ('tags' in updatedViolation) {
      violationUpdatedData['tags'] = updatedViolation.tags;
    }

    if ('toId' in updatedViolation) {
      violationUpdatedData['to'] = { connect: { id: updatedViolation.toId } };
    }

    if ('categoryId' in updatedViolation || 'newCategory' in updatedViolation) {
      violationUpdatedData['category'] = {};

      if ('categoryId' in updatedViolation)
        violationUpdatedData['category']['connect'] = { id: updatedViolation.categoryId };
      else violationUpdatedData['category']['create'] = updatedViolation.newCategory;
    }

    violationUpdatedData['updatedAt'] = new Date();

    await prisma.violation.update({
      data: violationUpdatedData,
      where: { id: violationId },
    });

    return true;
  } catch (err) {
    console.error(err);
    throw new ModelError(`Something went wrong while updating violation #${violationId}`, 500, {
      ...errorOptions,
      type: 'update',
    });
  }
}

export async function deleteByViolationId(violationId, errorOptions = {}) {
  try {
    await prisma.violation.delete({
      where: { id: violationId },
    });

    return true;
  } catch {
    throw new ModelError(`Something went wrong while updating violation #${violationId}`, 500, {
      ...errorOptions,
      type: 'delete',
    });
  }
}
