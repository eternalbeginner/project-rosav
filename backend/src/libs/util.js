import jwt from 'jsonwebtoken';

import tokenConfig from 'configs/token';

import AuthenticationError from 'errors/AuthenticationError';

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      regNumber: user.regNumber,
      name: user.name,
      roleSlug: user.role.slug,
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

export function responseFromThrowedError(res, err) {
  if (err instanceof AuthenticationError)
    return res.status(err.code).json({
      error: [{ type: 'field', msg: err.message, path: err.field }],
    });

  return res.status(500).json({
    message: err.message,
    error: [{ type: 'all', msg: err.message }],
  });
}
