import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { UserController } from './user.controller';

const router = express.Router();
const { ADMIN } = ENUM_USER_ROLE;
router.get('/', UserController.getAllFromDB);
router.get('/:id', UserController.getDataById);
router.delete('/:id', UserController.deleteById);
router.patch('/:id', UserController.updateIntoDB);

export const UserRoutes = router;
