import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-category',
  validateRequest(CategoryValidation.create),
  auth(ADMIN),
  CategoryController.insertIntoDB
);
router.get('/', auth(ADMIN, CUSTOMER), CategoryController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), CategoryController.getDataById);
router.delete('/:id', auth(ADMIN), CategoryController.deleteById);
router.patch('/:id', auth(ADMIN), CategoryController.updateIntoDB);

export const CategoryRoutes = router;
