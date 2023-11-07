import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BrandController } from './brand.controller';
import { BrandValidation } from './brand.validation';


const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-brand',
  validateRequest(BrandValidation.create),
  auth(ADMIN),
  BrandController.insertIntoDB
);
router.get('/', auth(ADMIN), BrandController.getAllFromDB);
router.get('/:id', auth(ADMIN), BrandController.getDataById);
router.delete('/:id', auth(ADMIN), BrandController.deleteById);
router.patch('/:id', auth(ADMIN), BrandController.updateIntoDB);

export const BrandRoutes = router;
