import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SupplierController } from './supplier.controller';
import { SupplierValidation } from './supplier.validation';


const router = express.Router();
const { ADMIN, CUSTOMER } = ENUM_USER_ROLE;
router.post(
  '/create-supplier',
  validateRequest(SupplierValidation.create),
  auth(ADMIN),
  SupplierController.insertIntoDB
);
router.get('/', SupplierController.getAllFromDB);
router.get('/:id', auth(ADMIN, CUSTOMER), SupplierController.getDataById);
router.delete('/:id', auth(ADMIN), SupplierController.deleteById);
router.patch('/:id', auth(ADMIN), SupplierController.updateIntoDB);

export const SupplierRoutes = router;
