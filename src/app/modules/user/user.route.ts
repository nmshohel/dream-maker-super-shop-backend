import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();
const { ADMIN } = ENUM_USER_ROLE;
router.get('/', auth(ADMIN), UserController.getAllFromDB);
router.get('/:id', auth(ADMIN), UserController.getDataById);
router.delete('/:id', auth(ADMIN), UserController.deleteById);
router.patch('/:id', auth(ADMIN), UserController.updateIntoDB);

export const UserRoutes = router;
