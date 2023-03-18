"use client";

import { useDrag } from "@/app/lib/drag-n-drop";
import { Task } from "@prisma/client";

type TaskProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  task: Task;
};

export default function TaskCard({ task, ...props }: TaskProps) {
  const charWidth = 60;
  const [isDragging, handleDragStart, handleDragEnd] = useDrag<{
    id: string;
  }>();
  return (
    <article
      draggable
      onDragStart={handleDragStart({ id: task.id })}
      onDragEnd={handleDragEnd}
      className="p-2 rounded-md bg-neutral-100 hover:bg-emerald-100 transition-colors"
      {...props}
    >
      <h3>{task.title}</h3>
      {task.description && (
        <p>
          {task.description.slice(0, charWidth) +
            ((task.description.length ?? 0) > charWidth ? "..." : "")}
        </p>
      )}
    </article>
  );
}
