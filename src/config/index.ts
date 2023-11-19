import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('3000')
    .refine((val) => Number(val)),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  STORE_ID: z.string(),
  STORE_PASS: z.string(),
  SSL_BASE_PAYMENT_URL: z.string(),
  SSL_BASE_VALIDATION_URL: z.string(),
  BCRYPT_SALT_ROUNDS: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    url: envVars.DATABASE_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    salt_round:envVars.BCRYPT_SALT_ROUNDS,
    expiren_in:envVars.JWT_EXPIRES_IN,
    refresh_secret:envVars.JWT_REFRESH_SECRET,
    refresh_secret_in:envVars.JWT_REFRESH_EXPIRES_IN

  },

  ssl: {
    storeId: envVars.STORE_ID,
    storePass: envVars.STORE_PASS,
    sslPaymentUrl: envVars.SSL_BASE_PAYMENT_URL,
    sslValidationUrl: envVars.SSL_BASE_VALIDATION_URL
  }
};