import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import passportJWT from 'passport-jwt';

import prisma from 'libs/prisma';

import appConfig from 'configs/app';
import tokenConfig from 'configs/token';

import routes from 'routes';

const app = express();

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.use(helmet({ hidePoweredBy: true, noSniff: true }));
app.use(morgan(appConfig.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(
  new passportJWT.Strategy(
    {
      algorithms: tokenConfig.algo,
      audience: tokenConfig.audience,
      issuer: tokenConfig.issuer,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      secretOrKey: tokenConfig.secret,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findFirstOrThrow({
          where: { id: payload.id },
          include: { major: true, role: true },
        });

        return done(null, user); // pass user data to the request
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

app.use('/api', routes);

app.listen(appConfig.port, () => {
  appConfig.nodeEnv === 'development' && console.log(`Listening on port ${appConfig.port}`);
});
