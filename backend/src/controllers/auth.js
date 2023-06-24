import { compareSync } from 'bcryptjs';
import { matchedData, validationResult } from 'express-validator';
import { decode, verify } from 'jsonwebtoken';

import tokenConfig from 'configs/token';

import * as userModel from 'models/user';
import { generateAccessToken, generateRefreshToken, responseFromThrowedError } from 'libs/util';

import AuthenticationError from 'errors/AuthenticationError';

export const reSignIn = async (req, res) => {
  const error = validationResult(req).errors;
  const data = matchedData(req);
  const user = req.user ?? decode(data.accessToken);

  if (error.length > 0) return res.status(400).json({ error });

  try {
    verify(data.refreshToken, tokenConfig.secret, (err, _) => {
      if (err) {
        throw new AuthenticationError('Invalid refresh token provided', 401, {
          type: 'body',
          path: 'refreshToken',
        });
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
    const user = await userModel.findByRegistrationNumber(data.regNumber, {
      type: 'field',
    });

    if (!compareSync(data.password, user.password)) {
      throw new AuthenticationError(`Wrong password provided for ${user.name}`, 400, {
        path: 'password',
      });
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

export const signOut = async (_, res) => {
  return res.json({});
};
