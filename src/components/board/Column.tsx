"use client";

import { useDrop } from "@/app/lib/drag-n-drop";
import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";
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
  const [isOverlapping, handleDragOver, handleDragLeave, handleDrop] =
    useDrop<Task>();
  const moveTask = async (data: Task) => {
    if (data.state === state) {
      return;
    }
    data.state = state;
    try {
      await fetch(`/api/board/${boardId}/task/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section className="flex flex-col" key={state}>
      <h5 className="mb-3">{state}</h5>
      <section
        className="grow flex flex-col gap-3"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop(moveTask)}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </section>
    </section>
  );
}
