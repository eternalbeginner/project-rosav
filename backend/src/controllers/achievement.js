import { matchedData, validationResult } from 'express-validator';

import * as model from 'models/achievement';
import { responseFromThrownError } from 'libs/util';

export async function findAll(_, res) {
  try {
    const achievements = await model.findAll();

    return res.json({
      data: achievements,
      error: [],
    });
  } catch (err) {
    return responseFromThrownError(res, err);
  }
}

export async function findById(req, res) {
  const error = validationResult(req).errors;
  const data = matchedData(req);

  if (error.length > 0) return res.status(400).json({ error });

  try {
    const achievement = await model.findByAchievementId(data.achievementId, { type: 'param' });

    return res.json({
      data: achievement,
      error,
    });
  } catch (err) {
    return responseFromThrownError(res, err);
  }
}

export async function create(req, res) {
  const error = validationResult(req).errors;
  const data = matchedData(req);

  if (error.length > 0) return res.status(400).json({ error });

  try {
    await model.create(data.fromId, data.toId, {
      title: data.title,
      description: data.description,
      points: data.points,
      tags: data.tags,

      ...('categoryId' in data
        ? { categoryId: data.categoryId }
        : { newCategory: data.newCategory }),
    });

    return res.json({
      message: 'New achievement created successfully',
      error,
    });
  } catch (err) {
    return responseFromThrownError(res, err);
  }
}

export async function updateById(req, res) {
  const error = validationResult(req).errors;
  const data = matchedData(req);

  if (error.length > 0) return res.status(400).json({ error });

  try {
    await model.updateByAchievementId(data.achievementId, data);

    return res.json({
      message: `Achievement #${data.achievementId} updated successfully`,
      error,
    });
  } catch (err) {
    return responseFromThrownError(res, err);
  }
}

export async function deleteById(req, res) {
  const error = validationResult(req).errors;
  const data = matchedData(req);

  if (error.length > 0) return res.status(400).json({ error });

  try {
    await model.deleteByAchievementId(data.achievementId);

    return res.json({
      message: `Achievement #${data.achievementId} deleted successfully`,
      error,
    });
  } catch (err) {
    return responseFromThrownError(res, err);
  }
}
