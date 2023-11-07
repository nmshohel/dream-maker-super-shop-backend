import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductTypeController } from './productType.controller';
import { ProductTypeValidation } from './productType.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-product-type',
  validateRequest(ProductTypeValidation.create),
  auth(ADMIN),
  ProductTypeController.insertIntoDB
);
router.get('/', auth(ADMIN, CUSTOMER), ProductTypeController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), ProductTypeController.getDataById);
router.delete('/:id', auth(ADMIN), ProductTypeController.deleteById);
router.patch('/:id', auth(ADMIN), ProductTypeController.updateIntoDB);

export const ProductTyeRoutes = router;
