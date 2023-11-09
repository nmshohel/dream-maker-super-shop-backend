import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();
router.post(
  '/create-payment',PaymentController.initPyament

);

router.post('/webhook', PaymentController.webhook)


router.get('/', 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
 PaymentController.getAllFromDB);
router.get('/:id', 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
 PaymentController.getByIdFromDB);



export const PaymentRoutes = router;