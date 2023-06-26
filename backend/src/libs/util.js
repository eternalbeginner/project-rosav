import jwt from 'jsonwebtoken';

import tokenConfig from 'configs/token';

import BaseError from 'errors/BaseError';

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      regNumber: user.regNumber,
      name: user.name,
      roleSlug: user.role?.slug ?? user.roleSlug,
    },
    tokenConfig.secret,
    {
      algorithm: tokenConfig.algo,
      audience: tokenConfig.audience,
      issuer: tokenConfig.issuer,
      subject: user.id,
      expiresIn: tokenConfig.accessTokenExpiresIn,
    },
  );
}

export function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, tokenConfig.secret, {
    algorithm: tokenConfig.algo,
    audience: tokenConfig.audience,
    issuer: tokenConfig.issuer,
    subject: user.id,
    expiresIn: tokenConfig.refreshTokenExpiresIn,
  });
}

export function responseFromThrownError(res, err) {
  if (err instanceof BaseError)
    return res.status(err.code).json({
      error: [{ type: err.type, msg: err.message, path: err.path }],
    });

  return res.status(500).json({
    message: err.message,
    error: [{ type: 'server', msg: err.message }],
  });
}
