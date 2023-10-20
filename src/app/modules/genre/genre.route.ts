import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { GenreController } from './genre.controller';
import { GenreValidation } from './genre.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-genre',
  validateRequest(GenreValidation.create),
  auth(ADMIN),
  GenreController.insertIntoDB
);
router.get('/', auth(ADMIN, CUSTOMER), GenreController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), GenreController.getDataById);
router.delete('/:id', auth(ADMIN), GenreController.deleteById);
router.patch('/:id', auth(ADMIN), GenreController.updateIntoDB);

export const GenreRoutes = router;
