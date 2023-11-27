import { z } from 'zod';

// const create = z.object({
//   body: z.array(
//     z.object({
//       product: z.string({
//         required_error: 'Product Id is required',
//       }),
//       quantity: z.string({
//         required_error: 'Quantity is required',
//       }),
//     })
//   ).refine(data => Array.isArray(data), {
//     message: 'Expected array, received object',
//   }),
//   orderType: z.string({ required_error: "Order type is required" }),
// });
const productSchema = z.object({
  productId: z.string().refine((productId) => !!productId, { message: 'ProductId is required' }),
  quantity: z.string().refine((quantity) => !!quantity, { message: 'Quantity is required' }),
});
const create = z.object({
  product: z.array(productSchema),
  orderType: z.string().refine((orderType) => orderType === 'cashOnDelivery', {
    message: 'Invalid orderType. Must be "cashOnDelivery".',
  }),
});

export const OrderValidation = {
  create,
};
