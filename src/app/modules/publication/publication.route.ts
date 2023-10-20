import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PublicationController } from './publication.controller';
import { PublicationValidation } from './publication.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-publication',
  validateRequest(PublicationValidation.create),
  auth(ADMIN),
  PublicationController.insertIntoDB
);
router.get('/', auth(ADMIN, CUSTOMER), PublicationController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), PublicationController.getDataById);
router.delete('/:id', auth(ADMIN), PublicationController.deleteById);
router.patch('/:id', auth(ADMIN), PublicationController.updateIntoDB);

export const PublicationRoutes = router;
