import { matchedData, validationResult } from 'express-validator';

import * as model from 'models/violation';
import { responseFromThrownError } from 'libs/util';

export async function findAll(_, res) {
  try {
    const violations = await model.findAll();

    return res.json({
      data: violations,
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
    const violation = await model.findByViolationId(data.violationId, { type: 'param' });

    return res.json({
      data: violation,
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
      message: 'New violation created successfully',
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
    await model.updateByViolationId(data.violationId, data);

    return res.json({
      message: `Violation #${data.violationId} updated successfully`,
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
    await model.deleteByViolationId(data.violationId);

    return res.json({
      message: `Violation #${data.violationId} deleted successfully`,
      error,
    });
  } catch (err) {
    return responseFromThrownError(res, err);
  }
}
