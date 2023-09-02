import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();
// const { SUPER_ADMIN, ADMIN, USER } = ENUM_USER_ROLE;
router.post('/', UserController.insertIntoDB);
router.get('/', UserController.getAllFromDB);
router.get('/:id', UserController.getDataById);
router.delete('/:id', UserController.deleteById);
router.patch('/:id', UserController.updateIntoDB);

export const UserRoutes = router;
