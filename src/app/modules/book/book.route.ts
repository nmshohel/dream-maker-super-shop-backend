import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BookController } from './book.controller';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post('/create-book', auth(ADMIN), BookController.insertIntoDB);
router.get('/', auth(ADMIN), BookController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), BookController.getDataById);
router.delete('/:id', auth(ADMIN), BookController.deleteById);
router.patch('/:id', auth(ADMIN), BookController.updateIntoDB);

export const BookRoutes = router;
