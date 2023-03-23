import { z } from "zod";
import { WithTimeStamps } from "./WithTimeStamps";
import { WithId } from "./WithId";

export const BoardCreateInput = z.object({
  name: z.string().trim().min(1),
});

export const BoardUpdateInput = BoardCreateInput.partial();

export const Board = BoardCreateInput.merge(WithId).merge(WithTimeStamps);

export type BoardCreateInput = z.infer<typeof BoardCreateInput>;
export type BoardUpdateInput = z.infer<typeof BoardUpdateInput>;
export type Board = z.infer<typeof Board>;
