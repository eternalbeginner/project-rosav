import { checkSchema } from 'express-validator';

export const login = checkSchema({
  regNumber: {
    in: 'body',
    exists: true,
    errorMessage: 'Invalid registration number provided',
    isEmpty: { negated: true },
    isLength: { options: { min: 9, max: 9 } },
    isNumeric: true,
  },
  password: {
    in: 'body',
    exists: true,
    errorMessage: 'Invalid password provided',
    isEmpty: { negated: true },
    isString: true,
  },
});
