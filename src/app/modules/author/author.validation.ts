import { z } from 'zod';

const create = z.object({
  body: z.object({
    nameInBengali: z.string().optional(),
    nameInEnglish: z.string({
      required_error: 'Name in english is required',
    }),
  }),
});
const update = z.object({
  title: z.string().optional(),
});
export const AuthorValidation = {
  create,
  update,
};
