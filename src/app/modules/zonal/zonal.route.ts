import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ZonalController } from './zonal.controller';
import { ZonalValidation } from './zonal.validation';

const router = express.Router();
router.post(
  '/create-zonal',
  validateRequest(ZonalValidation.create),
  ZonalController.insertIntoDB
);
router.get('/', ZonalController.getAllFromDB);
router.get('/:id', ZonalController.getDataById);
export const ZonalRoutes = router;
