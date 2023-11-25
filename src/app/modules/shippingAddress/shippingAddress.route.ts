import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ShippingAddressController } from './shippingAddress.controller';



const router = express.Router();

router.patch('/',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
 ShippingAddressController.updateAddress);
router.get('/',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
ShippingAddressController.getByEmail);


export const ShippingAddressRoutes = router;
