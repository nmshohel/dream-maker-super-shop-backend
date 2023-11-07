import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'title is required',
    }),

    price: z.string({
      required_error: 'price is required',
    }),
    discount: z.string().optional(),
   
    description: z.string().optional(),
    brandId: z.string().optional(),
    warranty: z.string({
      required_error: 'warranty is required',
    }),
    productCode: z.string().optional(),
    quantity: z.string({
      required_error: 'quantity is required',
    }),
    thumbImage: z.array(z.string()),
    images: z.array(z.string()),
    rate: z.string({
      required_error: 'rate is required',
    }),
    new: z.boolean().optional(),

    productTypeId: z.string({
      required_error: 'productTypeId is required',
    }),
    subCategoryId: z.string({
      required_error: 'subCategoryId is required',
    }),
    categoryId: z.string({
      required_error: 'categoryId is required',
    }),
  }),
});
export const ProductValidation = {
  create
};
