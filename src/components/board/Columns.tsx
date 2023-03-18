"use client";

import { useTasks } from "@/app/lib/queries";
import { Task } from "@prisma/client";
import Column from "./Column";

type ColumnsProps = {
  boardId: string;
  tasks: Task[];
  className: string;
};

export default function Columns({ boardId, tasks, className }: ColumnsProps) {
  const states = new Set(tasks.map((task) => task.state));
  const { data } = useTasks({ boardId, initialTasks: tasks });

  return (
    <section
      className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-x-auto overscroll-contain ${className}`}
    >
      {Array.from(states).map((state) => (
        <Column key={state} boardId={boardId} state={state} />
      ))}
    </section>
  );
}
