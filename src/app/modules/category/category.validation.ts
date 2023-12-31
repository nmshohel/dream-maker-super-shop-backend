import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error:"title is required"
    }),
    productTypeId: z.string({
      required_error:"Product type is required"
    }),
  }),
});
const update = z.object({
  title: z.string().optional(),
});
export const CategoryValidation = {
  create,
  update,
};
