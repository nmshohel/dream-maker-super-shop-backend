import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),

    price: z.string({
      required_error: 'price is required',
    }),
    discount: z.string().optional(),

    publicationDate: z.string({
      required_error: 'publication Date is required',
    }),

    description: z.string().optional(),
    quantity: z.string({
      required_error: 'quantity is required',
    }),
    thumbImage: z.array(z.string()),
    images: z.array(z.string()),
    rate: z.string({
      required_error: 'rate is required',
    }),
    new: z.boolean().optional(),

    publication: z.string({
      required_error: 'publication is required',
    }),
    authorIds: z.string({
      required_error: 'authorIds is required',
    }),
    genre: z.string({
      required_error: 'genre is required',
    }),
    subCategory: z.string({
      required_error: 'subCategory is required',
    }),
    category: z.string({
      required_error: 'category is required',
    }),
  }),
});
const update = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  price: z.string().optional(),
  genre: z.string().optional(),
  publicationDate: z.string().optional(),
  categoryId: z.string().optional(),
});
export const BookValidation = {
  create,
  update,
};
