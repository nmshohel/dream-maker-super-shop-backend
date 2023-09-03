import { z } from 'zod';

const create = z.object({
  orderId: z.string(),
  bookId: z.string(),
  quantity: z.string(),
});
const update = z.object({
  orderId: z.string().optional(),
  bookId: z.string().optional(),
  quantity: z.string().optional(),
});
export const OrderValidation = {
  create,
  update,
};
