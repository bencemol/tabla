"use client";

import { useTasks } from "@/app/lib/queries";
import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import TaskCard from "./TaskCard";

export default function Column({
  boardId,
  state: columnState,
}: {
  boardId: string;
  state: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: tasks } = useTasks({
    boardId,
    select: useCallback(
      (data: Task[]) => data.filter((task) => task.state === columnState),
      [columnState]
    ),
  });
  const moveTask = async (data: Task, priority = 0) => {
    if (data.state === columnState && data.priority === priority) {
      return;
    }
    data.state = columnState;
    data.priority = priority;
    try {
      await fetch(`/api/boards/${boardId}/tasks/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      startTransition(() => router.refresh());
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section className="flex flex-col" key={columnState}>
      <h5 className="mb-3">{columnState}</h5>
      <section className="grow">
        {tasks?.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={(d) => moveTask(d, index)}
            className="mb-3"
          />
        ))}
      </section>
    </section>
  );
}
