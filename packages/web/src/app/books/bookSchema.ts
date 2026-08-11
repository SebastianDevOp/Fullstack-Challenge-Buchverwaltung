import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().trim().min(1),
  authorId: z.coerce.number().int().positive(),
  isbn: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null),
  year: z.preprocess((v) => v || null, z.coerce.number().int().positive().nullable()),
});
