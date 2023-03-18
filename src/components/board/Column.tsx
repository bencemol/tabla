"use client";

import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import TaskCard from "./TaskCard";

export default function Column({
  boardId,
  state,
  tasks,
}: {
  boardId: string;
  state: string;
  tasks: Task[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const moveTask = async (data: Task, priority = 0) => {
    if (data.state === state && data.priority === priority) {
      return;
    }
    data.state = state;
    data.priority = priority;
    try {
      await fetch(`/api/board/${boardId}/task/${data.id}`, {
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
    <section className="flex flex-col" key={state}>
      <h5 className="mb-3">{state}</h5>
      <section className="grow">
        {tasks.map((task, index) => (
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
