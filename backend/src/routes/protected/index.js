import express from 'express';

import achievementRouter from './achievements';
import violationRouter from './violations';

const router = express.Router();

router.use('/achievements', achievementRouter);
// router.use('/categories');
// router.use('/majors');
// router.use('/roles');
router.use('/violations', violationRouter);
// router.use('/users');

export default router;
