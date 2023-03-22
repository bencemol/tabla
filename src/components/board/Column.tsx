"use client";

import { useTasks } from "@/lib/swr";
import { Task, TaskState } from "@prisma/client";
import { useDeferredValue } from "react";
import Draggable, { DropZone } from "./Draggable";
import TaskCard from "./TaskCard";

export default function Column({
  boardId,
  state,
}: {
  boardId: string;
  state: TaskState;
}) {
  const { data, mutate } = useTasks(boardId);
  const tasks = data?.filter((task) => task.stateId === state.id) ?? [];
  const deferredTasks = useDeferredValue(tasks);
  const moveTask = async (task: Task, toIndex: number) => {
    if (task.stateId === state.id && task.priority === toIndex) {
      return;
    }
    task.stateId = state.id;
    task.priority = toIndex;
    const fromIndex = tasks.findIndex(({ id }) => id === task.id);
    if (fromIndex >= 0) {
      tasks?.splice(fromIndex, 1);
    }
    if (fromIndex >= 0 && toIndex > fromIndex) {
      toIndex--;
    }
    tasks?.splice(toIndex, 0, task);
    const sortedTasks =
      tasks
        ?.filter((task) => task.stateId === state.id)
        .map((task, priority) => ({
          ...task,
          priority,
        })) ?? [];
    updateTasks(sortedTasks, task.id);
  };

  const updateTasks = async (tasks: Task[], movedTaskId: string) => {
    mutate(
      [
        ...data!.filter((t) => t.stateId !== state.id && t.id !== movedTaskId), // fast deduplication
        ...tasks,
      ],
      {
        revalidate: false,
      }
    );
    await fetch(`/api/boards/${boardId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
    });
    mutate();
  };

  return (
    <section className="flex flex-col" key={state.id}>
      <h5 className="pb-3 uppercase sticky top-0 z-10 bg-white dark:bg-stone-900">
        {state.name}
      </h5>
      <ul className="grow flex flex-col">
        {deferredTasks?.map((task, index) => (
          <Draggable
            key={task.id}
            item={task}
            onDrop={(d, o) => {
              const i =
                o === "bottom" ? Math.min(index + 1, tasks.length) : index;
              moveTask(d, i);
            }}
          >
            <TaskCard task={task} className="mb-3" />
          </Draggable>
        ))}
        <DropZone
          onDrop={(d: Task) => moveTask(d, tasks.length)}
          className="grow"
        />
      </ul>
    </section>
  );
}
