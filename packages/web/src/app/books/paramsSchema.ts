import { z } from "zod";

export const paramsSchema = z.object({
  q: z.string().optional().default(""),
  page: z.coerce.number().int().positive().max(999).catch(1),
});
