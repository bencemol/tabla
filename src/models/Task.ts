import { z } from "zod";
import { WithTimestamps } from "./WithTimestamps";
import { WithId } from "./WithId";

const WithPriority = z.object({
  priority: z.number(),
});

export const TaskCreateInput = z.object({
  title: z.string(),
  description: z.string().optional(),
  stateId: z.string().optional(),
});

export const TaskUpdateInput = TaskCreateInput.merge(WithPriority).partial();
export const TaskUpdateManyInput = TaskUpdateInput.merge(WithId).array();

export const Task = TaskCreateInput.extend({
  boardId: z.string(),
  stateId: z.string(),
})
  .merge(WithId)
  .merge(WithPriority)
  .merge(WithTimestamps);

export type TaskCreateInput = z.infer<typeof TaskCreateInput>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateInput>;
export type TaskUpdateManyInput = z.infer<typeof TaskUpdateManyInput>;
export type Task = z.infer<typeof Task>;
