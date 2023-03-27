import { z } from "zod";

export const WithTimestamps = z.object({
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
});

export type WithTimestamps = z.infer<typeof WithTimestamps>;
