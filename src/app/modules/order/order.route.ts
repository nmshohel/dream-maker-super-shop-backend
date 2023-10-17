import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-order',
  validateRequest(OrderValidation.create),
  auth(CUSTOMER, ADMIN),
  OrderController.insertIntoDB
);
router.get('/', auth(ADMIN), OrderController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), OrderController.getDataById);
router.delete('/:id', auth(ADMIN), OrderController.deleteById);
router.patch('/:id', auth(ADMIN), OrderController.updateIntoDB);

export const OrderRoutes = router;
