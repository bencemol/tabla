"use client";

import { Task } from "@prisma/client";
import { SWRConfig, unstable_serialize } from "swr";
import Column from "./Column";

type ColumnsProps = {
  boardId: string;
  tasks: Task[];
  className: string;
};

export default function Columns({ boardId, tasks, className }: ColumnsProps) {
  const states = ["TODO", "IN PROGRESS", "DONE"];
  const fallback = {
    [unstable_serialize(["api", "boards", boardId, "tasks"])]: tasks,
  };

  return (
    <section
      className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-x-auto overscroll-contain ${className}`}
    >
      <SWRConfig value={{ fallback }}>
        {states.map((state) => (
          <Column key={state} boardId={boardId} state={state} />
        ))}
      </SWRConfig>
    </section>
  );
}
