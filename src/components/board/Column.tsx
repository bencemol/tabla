"use client";

import { useTasks } from "@/lib/swr";
import { Task } from "@/models/Task";
import { TaskState } from "@/models/TaskState";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useDeferredValue } from "react";
import CreateTaskInline from "./CreateTaskInline";
import Draggable, { DropZone } from "./Draggable";
import TaskCard from "./TaskCard";

export default function Column({ state }: { state: TaskState }) {
  const charLength = 38;
  const { data, mutate } = useTasks(state.boardId);
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
    await fetch(`/api/boards/${state.boardId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
    });
    mutate();
  };

  return (
    <section
      className="flex flex-col [&:hover_.edit]:opacity-100"
      key={state.id}
    >
      <header
        className="h-14 grid grid-flow-col items-center pb-3 sticky top-0 z-10 bg-white dark:bg-stone-900 shadow-white dark:shadow-stone-900"
        style={{ boxShadow: "0 -2px 0 3px var(--tw-shadow-color)" }}
      >
        <h5 className="uppercase mr-1">
          {state.name.slice(0, charLength) +
            ((state.name.length ?? 0) > charLength ? "..." : "")}
        </h5>
        <span className="edit ml-auto sm:opacity-0 sm:focus-within:opacity-100 transition-opacity">
          <Link
            href={`/boards/${state.boardId}/states/${state.id}`}
            className="block p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <IconPencil size={16} stroke={1.5} />
          </Link>
        </span>
      </header>
      <ul className="grow flex flex-col py-2 mb-10">
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
        >
          <CreateTaskInline boardId={state.boardId} stateId={state.id} />
        </DropZone>
      </ul>
    </section>
  );
}
