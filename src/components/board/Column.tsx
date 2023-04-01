"use client";

import { useTasks } from "@/lib/swr";
import { Task } from "@/models/task";
import { TaskState } from "@/models/task-state";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo } from "react";
import CreateTaskInline from "./CreateTaskInline";
import Draggable, { DropZone } from "./Draggable";
import TaskCard from "./TaskCard";

export default function Column({
  state,
  className = "",
}: {
  state: TaskState;
  className?: string;
}) {
  const { data, mutate } = useTasks(state.boardId);
  const tasks = useMemo(
    () => data?.filter((task) => task.stateId === state.id) ?? [],
    [data, state.id]
  );

  const moveTask = (task: Task, toIndex: number) => {
    const fromIndex = tasks.findIndex(({ id }) => id === task.id);
    if (fromIndex >= 0 && toIndex > fromIndex) {
      toIndex--;
    }
    if (task.stateId === state.id && task.priority === toIndex) {
      return;
    }
    if (fromIndex >= 0) {
      tasks?.splice(fromIndex, 1);
    }
    task.stateId = state.id;
    task.priority = toIndex;
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
      className={`relative flex flex-col [&:hover_.edit]:opacity-100 ${className}`}
      key={state.id}
    >
      <header
        id="dragHandle"
        className="h-14 grid grid-flow-col items-center -m-1 p-1 pb-3 sticky -top-1 z-10 cursor-grab bg-white dark:bg-zinc-900"
      >
        <h5
          className="uppercase mr-1 line-clamp-2"
          style={{ wordBreak: "break-word" }}
        >
          {state.name}
        </h5>
        <span className="edit ml-auto sm:opacity-0 sm:focus-within:opacity-100 transition-opacity">
          <Link
            href={`/boards/${state.boardId}/states/${state.id}`}
            className="block p-2 rounded-md hover:bg-zinc-200 focus:bg-zinc-200 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
          >
            <IconPencil size={16} stroke={1.5} />
          </Link>
        </span>
      </header>
      <ul className="grow flex flex-col py-2 mb-10">
        {tasks?.map((task, index) => (
          <Draggable
            key={task.id}
            item={task}
            dragContext="task"
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
          dragContext="task"
          onDrop={(d: Task) => moveTask(d, tasks.length)}
          className="grow transition-transform"
        >
          <CreateTaskInline boardId={state.boardId} stateId={state.id} />
        </DropZone>
      </ul>
    </section>
  );
}
