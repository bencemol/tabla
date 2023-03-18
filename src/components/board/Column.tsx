"use client";

import { useDrop } from "@/app/lib/drag-n-drop";
import { Task } from "@prisma/client";
import TaskCard from "./TaskCard";

export default function Column({
  status,
  tasks,
}: {
  status: string;
  tasks: Task[];
}) {
  const [isOverlapping, handleDragOver, handleDragLeave, handleDrop] = useDrop<{
    id: string;
  }>();
  const moveTask = (task: { id: string }) => console.log(task);
  return (
    <section className="flex flex-col" key={status}>
      <h5 className="mb-3">{status}</h5>
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
