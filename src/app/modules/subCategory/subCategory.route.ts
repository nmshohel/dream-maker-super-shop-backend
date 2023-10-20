import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryValidation } from './subCategory.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-sub-category',
  validateRequest(SubCategoryValidation.create),
  auth(ADMIN),
  SubCategoryController.insertIntoDB
);
router.get('/', auth(ADMIN, CUSTOMER), SubCategoryController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), SubCategoryController.getDataById);
router.delete('/:id', auth(ADMIN), SubCategoryController.deleteById);
router.patch('/:id', auth(ADMIN), SubCategoryController.updateIntoDB);

export const SubCategoryRoutes = router;
