import { checkSchema } from 'express-validator';

export const findById = checkSchema({
  achievementId: {
    in: 'params',
    errorMessage: 'Invalid achievement id provided',
    exists: { bail: true, errorMessage: 'Parameter achievement id is required' },
    isString: { bail: true },
  },
});

export const create = checkSchema({
  categoryId: {
    in: 'body',
    optional: true,
    errorMessage: 'Invalid achievement id provided',
    isString: { bail: true },
  },
  fromId: {
    in: 'body',
    errorMessage: 'Invalid from id provided',
    exists: { bail: true, errorMessage: 'Field from id is required' },
    isString: { bail: true },
  },
  toId: {
    in: 'body',
    errorMessage: 'Invalid to id provided',
    exists: { bail: true, errorMessage: 'Field to id is required' },
    isString: { bail: true },
  },
  title: {
    in: 'body',
    errorMessage: 'Invalid title provided',
    exists: { bail: true, errorMessage: 'Field title is required' },
    isLength: {
      bail: true,
      options: { min: 1, max: 100 },
      errorMessage: 'Invalid title, must be at least 1 and at max 100',
    },
    isString: { bail: true },
  },
  description: {
    in: 'body',
    errorMessage: 'Invalid description provided',
    exists: { bail: true, errorMessage: 'Field description is required' },
    isLength: {
      bail: true,
      options: { min: 10, max: 1000 },
      errorMessage: 'Invalid description, must be at least 1 and at max 10000',
    },
    isString: { bail: true },
  },
  points: {
    in: 'body',
    errorMessage: 'Invalid points provided',
    exists: { bail: true, errorMessage: 'Field points are required' },
    isInt: { bail: true },
  },
  tags: {
    in: 'body',
    errorMessage: 'Invalid tags provided',
    exists: { bail: true, errorMessage: 'Field tags are required' },
    isArray: { bail: true },
  },
  'newCategory.name': {
    in: 'body',
    optional: true,
    errorMessage: 'Invalid category name provided',
    isString: { bail: true },
  },
  'newCategory.slug': {
    in: 'body',
    optional: true,
    errorMessage: 'Invalid slug name provided',
    isSlug: { bail: true },
    isString: { bail: true },
  },
});

export const updateById = checkSchema({
  achievementId: {
    in: 'params',
    errorMessage: 'Invalid achievement id provided',
    exists: { bail: true, errorMessage: 'Parameter achievement id is required' },
    isString: { bail: true },
  },
  categoryId: {
    in: 'body',
    optional: true,
    errorMessage: 'Invalid category id provided',
    isString: { bail: true },
  },
  toId: {
    in: 'body',
    errorMessage: 'Invalid to id provided',
    optional: true,
    isString: { bail: true },
  },
  title: {
    in: 'body',
    errorMessage: 'Invalid title provided',
    optional: true,
    isLength: {
      bail: true,
      options: { min: 1, max: 100 },
      errorMessage: 'Invalid title, must be at least 1 and at max 100',
    },
    isString: { bail: true },
  },
  description: {
    in: 'body',
    errorMessage: 'Invalid description provided',
    optional: true,
    isLength: {
      bail: true,
      options: { min: 10, max: 1000 },
      errorMessage: 'Invalid description, must be at least 1 and at max 10000',
    },
    isString: { bail: true },
  },
  points: {
    in: 'body',
    errorMessage: 'Invalid points provided',
    optional: true,
    isInt: { bail: true },
  },
  tags: {
    in: 'body',
    errorMessage: 'Invalid tags provided',
    optional: true,
    isArray: { bail: true },
  },
  'newCategory.name': {
    in: 'body',
    optional: true,
    errorMessage: 'Invalid category name provided',
    isString: { bail: true },
  },
  'newCategory.slug': {
    in: 'body',
    optional: true,
    errorMessage: 'Invalid slug name provided',
    isSlug: { bail: true },
    isString: { bail: true },
  },
});

export const deleteById = checkSchema({
  achievementId: {
    in: 'params',
    errorMessage: 'Invalid achievement id provided',
    exists: { bail: true, errorMessage: 'Parameter achievement id is required' },
    isString: { bail: true },
  },
});
