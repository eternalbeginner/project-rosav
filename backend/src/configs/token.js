const config = {
  algo: process.env.TOKEN_ALGO,
  secret: process.env.TOKEN_SECRET,
  audience: process.env.TOKEN_AUDIENCE,
  issuer: process.env.TOKEN_ISSUER,
  accessTokenExpiresIn: process.env.TOKEN_ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.TOKEN_REFRESH_TOKEN_EXPIRES_IN,
};

export default config;
