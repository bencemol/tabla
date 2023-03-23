import { z } from "zod";
import { WithTimeStamps } from "./WithTimeStamps";
import { WithId } from "./WithId";

const WithPriority = z.object({
  priority: z.number(),
});

export const TaskCreateInput = z.object({
  title: z.string(),
  description: z.string().optional(),
  stateId: z.string().optional(),
});

export const TaskUpdateInput = TaskCreateInput.merge(WithPriority)
  .partial()
  .merge(WithId);

export const Task = TaskCreateInput.extend({
  boardId: z.string(),
  stateId: z.string(),
})
  .merge(WithId)
  .merge(WithPriority)
  .merge(WithTimeStamps);

export type TaskCreateInput = z.infer<typeof TaskCreateInput>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateInput>;
export type Task = z.infer<typeof Task>;
