import express from 'express';
import passport from 'passport';

import * as authController from 'controllers/auth';
import * as authValidation from 'validations/auth';

const router = express.Router();
const passportAuthenticateJWT = passport.authenticate('jwt', { session: false });

router.post('/login', authValidation.login, authController.signIn);
router.post('/logout', passportAuthenticateJWT, authController.signOut);
router.post('/rotate', authValidation.rotate, authController.reSignIn);

export default router;
