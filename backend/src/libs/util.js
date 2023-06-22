import jwt from 'jsonwebtoken';

import tokenConfig from 'configs/token';

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
