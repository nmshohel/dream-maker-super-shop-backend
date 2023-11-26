import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({
      required_error:"name is required"
    }),
    address: z.string({
      required_error:"address is required"
    }),
    contactNo: z.string({
      required_error:"contactNo is required"
    }),
  }),
});
const update = z.object({
  title: z.string().optional(),
});
export const SupplierValidation = {
  create,
  update,
};
