"use client";

import { Task, TaskState } from "@prisma/client";
import { SWRConfig } from "swr";
import Column from "./Column";
import { useDeferredValue } from "react";
import CreateState from "./CreateState";

type ColumnsProps = {
  boardId: string;
  tasks: Task[];
  states: TaskState[];
  className: string;
};

export default function Columns({
  boardId,
  tasks,
  states,
  className,
}: ColumnsProps) {
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

  const deferredFallback = useDeferredValue(fallback);

  return (
    <SWRConfig value={{ fallback: deferredFallback }}>
      <section
        className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-x-auto overscroll-x-contain ${className}`}
      >
        {states.map((state) => (
          <Column key={state.id} boardId={boardId} state={state} />
        ))}
        <CreateState boardId={boardId} />
      </section>
    </SWRConfig>
  );
}
