import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { UserController } from './user.controller';

const router = express.Router();
const { ADMIN } = ENUM_USER_ROLE;
router.get('/', UserController.getAllFromDB);
router.get('/:email', UserController.getDataById);
router.delete('/:email', UserController.deleteById);
router.patch('/', UserController.updateIntoDB);

export const UserRoutes = router;
