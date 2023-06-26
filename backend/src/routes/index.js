import express from 'express';
import passport from 'passport';

import authRouter from './auth';
import protectedRouter from './protected';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/p', passport.authenticate('jwt', { session: false }), protectedRouter);

export default router;
