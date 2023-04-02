import { z } from "zod";

export const Search = z.object({
  query: z.string().trim().min(1),
});

export type Search = z.infer<typeof Search>;
