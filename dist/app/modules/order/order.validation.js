"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
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
const productSchema = zod_1.z.object({
    productId: zod_1.z.string().refine((productId) => !!productId, { message: 'ProductId is required' }),
    quantity: zod_1.z.string().refine((quantity) => !!quantity, { message: 'Quantity is required' }),
});
const create = zod_1.z.object({
    product: zod_1.z.array(productSchema),
    orderType: zod_1.z.string().refine((orderType) => orderType === 'cashOnDelivery', {
        message: 'Invalid orderType. Must be "cashOnDelivery".',
    }),
});
exports.OrderValidation = {
    create,
};
