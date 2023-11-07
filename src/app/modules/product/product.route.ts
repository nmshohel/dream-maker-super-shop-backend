import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';


const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-product',
  validateRequest(ProductValidation.create),
  auth(ADMIN),
  ProductController.insertIntoDB
);
router.get('/', ProductController.getAllFromDB);
router.get('/:id', ProductController.getDataById);
router.delete('/:id', auth(ADMIN), ProductController.deleteById);
router.patch('/:id', auth(ADMIN), ProductController.updateIntoDB);

export const ProductRoutes = router;
