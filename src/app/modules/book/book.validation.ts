import { z } from 'zod';

const create = z.object({
  title: z.string(),
  author: z.string(),
  price: z.string(),
  genre: z.string(),
  publicationDate: z.string(),
  categoryId: z.string(),
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
