import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    mobileNo: z.string({
      required_error: 'Mobile No is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const signUpZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
    role: z.string({
      required_error: 'role is required',
    }),
    contactNo: z.string({
      required_error: 'contact No is required',
    }),
    profileImg: z.string().optional(),
  }),
});
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
  signUpZodSchema,
};
