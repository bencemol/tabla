import { z } from "zod";
import { WithId } from "./with-id";
import { WithTimestamps } from "./with-timestamps";
import { Task } from "./task";

const WithOrder = z.object({
  order: z.number(),
});

export const TaskStateCreateInput = z.object({
  name: z.string(),
});

export const TaskStateUpdateInput =
  TaskStateCreateInput.merge(WithOrder).partial();
export const TaskStateUpdateManyInput =
  TaskStateUpdateInput.merge(WithId).array();

export const TaskState = TaskStateCreateInput.extend({
  boardId: z.string(),
})
  .merge(WithId)
  .merge(WithOrder)
  .merge(WithTimestamps);

export const TaskStateWithTasks = TaskState.extend({
  tasks: Task.array(),
});

export type TaskStateCreateInput = z.infer<typeof TaskStateCreateInput>;
export type TaskStateUpdateInput = z.infer<typeof TaskStateUpdateInput>;
export type TaskStateUpdateManyInput = z.infer<typeof TaskStateUpdateManyInput>;
export type TaskState = z.infer<typeof TaskState>;
export type TaskStateWithTasks = z.infer<typeof TaskStateWithTasks>;
