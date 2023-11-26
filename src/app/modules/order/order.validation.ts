import { z } from 'zod';

const create = z.object({
  body: z.array(
    z.object({
      productId: z.string({
        required_error: 'Product Id is required',
      }),
      quantity: z.string({
        required_error: 'Quantity is required',
      }),
    })
  ).refine(data => Array.isArray(data), {
    message: 'Expected array, received object',
  }),
  orderType: z.string({ required_error: "Order type is required" }),
});

export const OrderValidation = {
  create,
};
