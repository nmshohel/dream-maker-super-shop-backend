import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();
const { ADMIN,CUSTOMER } = ENUM_USER_ROLE;
router.get('/', UserController.getAllFromDB);
router.get('/:email', UserController.getDataById);
router.get('/user/email',auth(ADMIN,CUSTOMER), UserController.getSingleUser);
router.delete('/',auth(ADMIN), UserController.deleteById);
router.patch('/', auth(ADMIN,CUSTOMER),UserController.updateIntoDB);

export const UserRoutes = router;
