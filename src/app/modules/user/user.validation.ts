// import { UserRole } from '@prisma/client';
// import { z } from 'zod';

// const create = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   password: z.string(),
//   role: z.enum([...Object.values(UserRole)] as [string, ...string[]], {}),
//   contactNo: z.string(),
//   address: z.string(),
//   profileImg: z.string(),
// });
// const update = z.object({
//   name: z.string().optional(),
//   email: z.string().email().optional(),
//   password: z.string().optional(),
//   role: z
//     .enum([...Object.values(UserRole)] as [string, ...string[]], {})
//     .optional(),
//   contactNo: z.string().optional(),
//   address: z.string().optional(),
//   profileImg: z.string().optional(),
// });
// export const UserValidation = {
//   create,
//   update,
// };
