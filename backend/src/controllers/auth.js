import { compareSync } from 'bcryptjs';
import { matchedData, validationResult } from 'express-validator';

import prisma from 'libs/prisma';
import { generateAccessToken, generateRefreshToken } from 'libs/util';

class AuthenticationError extends Error {
  constructor(message, field, code = 500) {
    super(message);

    this.code = code;
    this.field = field;
  }
}

export const rotate = async (req, res) => {
  return res.json({});
};

export const signIn = async (req, res) => {
  const error = validationResult(req).errors;
  const data = matchedData(req);

  if (error.length > 0) return res.status(400).json({ error });

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { regNumber: data.regNumber },
      include: { role: true },
    });

    if (!compareSync(data.password, user.password)) {
      throw new AuthenticationError(`Wrong password provided for ${user.name}`, 'password', 400);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      data: {
        accessToken,
        refreshToken,
      },
      error,
    });
  } catch (err) {
    if (err instanceof AuthenticationError)
      return res.status(err.code).json({
        error: [{ type: 'field', msg: err.message, path: err.field }],
      });

    return res.status(500).json({
      message: err.message,
      error: [{ type: 'all', msg: err.message }],
    });
  }
};

export const signOut = async (req, res) => {
  return res.json({});
};
