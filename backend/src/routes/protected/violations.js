import express from 'express';

import * as violationController from 'controllers/violation';
import * as violationValidation from 'validations/violation';

const router = express.Router();

router.get('/', violationController.findAll);
router.get('/:violationId', violationValidation.findById, violationController.findById);
router.post('/', violationValidation.create, violationController.create);
router.put('/:violationId', violationValidation.updateById, violationController.updateById);
router.delete('/:violationId', violationValidation.deleteById, violationController.deleteById);

export default router;
