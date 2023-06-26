import express from 'express';

import * as achievementController from 'controllers/achievement';
import * as achievementValidation from 'validations/achievement';

const router = express.Router();

router.get('/', achievementController.findAll);
router.get('/:achievementId', achievementValidation.findById, achievementController.findById);
router.post('/', achievementValidation.create, achievementController.create);
router.put('/:achievementId', achievementValidation.updateById, achievementController.updateById);
router.delete(
  '/:achievementId',
  achievementValidation.deleteById,
  achievementController.deleteById,
);

export default router;
