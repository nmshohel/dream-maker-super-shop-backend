import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AddressController } from './address.controller';


const router = express.Router();

router.patch('/:email',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
 AddressController.updateAddress);
router.get('/:email',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
 AddressController.getByEmail);


export const AddressRoutes = router;
