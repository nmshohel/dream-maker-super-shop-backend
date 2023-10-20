import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string(),
  }),
});
const update = z.object({
  title: z.string().optional(),
});
export const GenreValidation = {
  create,
  update,
};
