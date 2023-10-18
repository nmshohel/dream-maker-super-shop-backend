import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthorController } from './author.controller';
import { AuthorValidation } from './author.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-author',
  validateRequest(AuthorValidation.create),
  auth(ADMIN),
  AuthorController.insertIntoDB
);
router.get('/', auth(ADMIN, CUSTOMER), AuthorController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), AuthorController.getDataById);
router.delete('/:id', auth(ADMIN), AuthorController.deleteById);
router.patch('/:id', auth(ADMIN), AuthorController.updateIntoDB);

export const AuthorRoutes = router;
