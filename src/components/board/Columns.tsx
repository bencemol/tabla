"use client";

import { Task } from "@prisma/client";
import { SWRConfig } from "swr";
import Column from "./Column";

type ColumnsProps = {
  boardId: string;
  tasks: Task[];
  className: string;
};

export default function Columns({ boardId, tasks, className }: ColumnsProps) {
  const states = ["TODO", "IN PROGRESS", "DONE"];
  const tasksFallback = tasks.reduce(
    (fallback, task) => ({
      ...fallback,
      [`/api/boards/${task.boardId}/tasks/${task.id}`]: task,
    }),
    {}
  );
  const fallback = {
    [`/api/boards/${boardId}/tasks`]: tasks,
    ...tasksFallback,
  };

  return (
    <SWRConfig value={{ fallback }}>
      <section
        className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-x-auto overscroll-x-contain ${className}`}
      >
        {states.map((state) => (
          <Column key={state} boardId={boardId} state={state} />
        ))}
      </section>
    </SWRConfig>
  );
}
