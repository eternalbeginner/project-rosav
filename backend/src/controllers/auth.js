import { compareSync } from 'bcryptjs';
import { matchedData, validationResult } from 'express-validator';
import { verify } from 'jsonwebtoken';

import tokenConfig from 'configs/token';

import prisma from 'libs/prisma';
import { generateAccessToken, generateRefreshToken, responseFromThrowedError } from 'libs/util';

import AuthenticationError from 'errors/AuthenticationError';

export const reSignIn = async (req, res) => {
  const error = validationResult(req).errors;
  const data = matchedData(req);
  const user = req.user;

  if (error.length > 0) return res.status(400).json({ error });

  try {
    verify(data.refreshToken, tokenConfig.secret, (err, _) => {
      if (err) {
        throw new AuthenticationError('Invalid refresh token provided', 'refreshToken', 401);
      }

      const newAccessToken = generateAccessToken(user);

      return res.json({
        data: {
          accessToken: newAccessToken,
          refreshToken: data.refreshToken,
        },
      });
    });
  } catch (err) {
    return responseFromThrowedError(res, err);
  }
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
    return responseFromThrowedError(res, err);
  }
};

export const signOut = async (req, res) => {
  return res.json({});
};
