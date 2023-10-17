import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'title is required',
    }),
    author: z.string({
      required_error: 'author is required',
    }),
    price: z.string({
      required_error: 'price is required',
    }),
    discount: z.string().optional(),
    genre: z.string({
      required_error: 'genre is required',
    }),
    publicationDate: z.string({
      required_error: 'publication Date is required',
    }),
    publicationBy: z.string({
      required_error: 'publication is required',
    }),
    quantity: z.string({
      required_error: 'quantity is required',
    }),
    description: z.string().optional(),
    categoryId: z.string({
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
