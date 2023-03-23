import { z } from "zod";
import { WithId } from "./WithId";
import { WithTimestamps } from "./WithTimestamps";
import { Task } from "./Task";

const WithOrder = z.object({
  order: z.number(),
});

export const TaskStateCreateInput = z.object({
  name: z.string(),
});

export const TaskStateUpdateInput =
  TaskStateCreateInput.merge(WithOrder).partial();

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
export type TaskState = z.infer<typeof TaskState>;
export type TaskStateWithTasks = z.infer<typeof TaskStateWithTasks>;
