"use client";

import { useDrag, useDrop } from "@/app/lib/drag-n-drop";
import { Task } from "@prisma/client";

type TaskProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  task: Task;
  onMove: (data: Task) => void;
};

export default function TaskCard({
  task,
  onMove,
  className,
  ...props
}: TaskProps) {
  const charWidth = 60;
  const [isDragging, handleDragStart, handleDragEnd] = useDrag<Task>();
  const [isOverlapping, handleDragOver, handleDragLeave, handleDrop] =
    useDrop<Task>();

  return (
    <article
      draggable
      onDragStart={handleDragStart(task)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop(onMove)}
      className={`p-2 rounded-md bg-neutral-100 hover:bg-emerald-100 dark:bg-neutral-800 dark:hover:bg-emerald-900 transition-all 
      ${isOverlapping && "drag-over"} ${
        isDragging && "opacity-50"
      } ${className}`}
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
