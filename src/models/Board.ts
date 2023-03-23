import { z } from "zod";
import { WithTimeStamps } from "./WithTimeStamps";

export const BoardCreateInput = z.object({
  name: z.string().trim().min(1),
});

export const Board = BoardCreateInput.extend({
  id: z.string(),
}).merge(WithTimeStamps);

export type BoardCreateInput = z.infer<typeof BoardCreateInput>;
export type Board = z.infer<typeof Board>;
