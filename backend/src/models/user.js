import prisma from 'libs/prisma';

import ModelError from 'errors/ModelError';

export async function findAll(errorOptions = {}) {
  try {
    const users = await prisma.user.findMany({
      include: {
        major: true,
        role: true,
        _count: {
          select: {
            obtainedAchievements: true,
            obtainedViolations: true,
            reportedAchievements: true,
            reportedViolations: true,
          },
        },
      },
    });

    return users;
  } catch (err) {
    throw new ModelError('Something went wrong', 500, {
      ...errorOptions,
      type: 'fetch',
    });
  }
}

export async function findById(userId, errorOptions = {}) {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      include: {
        major: true,
        role: true,
        _count: {
          select: {
            obtainedAchievements: true,
            obtainedViolations: true,
            reportedAchievements: true,
            reportedViolations: true,
          },
        },
      },
    });

    return user;
  } catch (err) {
    throw new ModelError(`No user found with id #${userId}`, 404, {
      ...errorOptions,
      path: 'id',
    });
  }
}

export async function findByRegistrationNumber(registrationNumber, errorOptions = {}) {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { regNumber: registrationNumber },
      include: {
        major: true,
        role: true,
        _count: {
          select: {
            obtainedAchievements: true,
            obtainedViolations: true,
            reportedAchievements: true,
            reportedViolations: true,
          },
        },
      },
    });

    return user;
  } catch (err) {
    throw new ModelError(`No user found with registration number #${registrationNumber}`, 404, {
      ...errorOptions,
      path: 'regNumber',
    });
  }
}
