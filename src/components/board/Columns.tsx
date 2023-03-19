"use client";

import { DragContext } from "@/app/lib/drag-n-drop";
import { Task } from "@prisma/client";
import { useState } from "react";
import { SWRConfig } from "swr";
import Column from "./Column";

type ColumnsProps = {
  boardId: string;
  tasks: Task[];
  className: string;
};

export default function Columns({ boardId, tasks, className }: ColumnsProps) {
  const states = ["TODO", "IN PROGRESS", "DONE"];
  const fallback = {
    [`/api/boards/${boardId}/tasks`]: tasks,
  };
  const [dragTarget, setDragTarget] = useState<HTMLElement>();

  return (
    <section
      className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-x-auto overscroll-contain ${className}`}
    >
      <SWRConfig value={{ fallback }}>
        <DragContext.Provider value={{ dragTarget, setDragTarget }}>
          {states.map((state) => (
            <Column key={state} boardId={boardId} state={state} />
          ))}
        </DragContext.Provider>
      </SWRConfig>
    </section>
  );
}
