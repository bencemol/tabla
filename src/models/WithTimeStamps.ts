import { z } from "zod";

export const WithTimeStamps = z.object({
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
});

export type WithTimeStamps = z.infer<typeof WithTimeStamps>;
