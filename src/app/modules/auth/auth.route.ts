import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post('/signin', AuthController.loginUser);
router.post(
  '/signup',
  validateRequest(AuthValidation.signUpZodSchema),
  AuthController.insertIntoDB
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
