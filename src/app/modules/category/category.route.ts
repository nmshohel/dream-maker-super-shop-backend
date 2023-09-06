import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CategoryController } from './category.controller';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post('/create-category', auth(ADMIN), CategoryController.insertIntoDB);
router.get('/', auth(ADMIN, CUSTOMER), CategoryController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), CategoryController.getDataById);
router.delete('/:id', auth(ADMIN), CategoryController.deleteById);
router.patch('/:id', auth(ADMIN), CategoryController.updateIntoDB);

export const CategoryRoutes = router;
