import { checkSchema } from 'express-validator';

export const login = checkSchema({
  regNumber: {
    in: 'body',
    exists: { bail: true, errorMessage: 'Registration number field is required' },
    errorMessage: 'Invalid registration number provided',
    isEmpty: { bail: true, negated: true },
    isLength: { options: { min: 9, max: 9 } },
    isNumeric: { bail: true },
  },
  password: {
    in: 'body',
    exists: { bail: true, errorMessage: 'Password field is required' },
    errorMessage: 'Invalid password provided',
    isEmpty: { bail: true, negated: true },
    isString: true,
  },
});

export const rotate = checkSchema({
  accessToken: {
    in: 'body',
    exists: { bail: true, errorMessage: 'Access token is required' },
    errorMessage: 'Invalid access token provided',
    isEmpty: { bail: true, negated: true },
    isString: true,
  },
  refreshToken: {
    in: 'body',
    exists: { bail: true, errorMessage: 'Refresh token is required' },
    errorMessage: 'Invalid refresh token provided',
    isEmpty: { bail: true, negated: true },
    isString: true,
  },
});
