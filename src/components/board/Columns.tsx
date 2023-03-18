import { db } from "@/app/db";
import { Task } from "@prisma/client";
import Column from "./Column";

function getTasks(boardId: string) {
  return db.task.findMany({
    where: { boardId },
    orderBy: [{ state: "desc" }, { priority: "asc" }],
  });
}

function groupTasksByState(tasks: Task[]): Map<string, Task[]> {
  const columns = new Map<string, Task[]>();
  for (const task of tasks) {
    const column = columns.get(task.state) ?? [];
    column.push(task);
    columns.set(task.state, column);
  }
  return columns;
}

type BoardProps = {
  boardId: string;
  className: string;
};

export default async function Columns({ boardId, className }: BoardProps) {
  const columns = await getTasks(boardId).then(groupTasksByState);

  return (
    <section
      className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-x-auto overscroll-contain ${className}`}
    >
      {Array.from(columns.keys()).map((state) => (
        <Column
          key={state}
          boardId={boardId}
          state={state}
          tasks={columns.get(state) ?? []}
        />
      ))}
    </section>
  );
}
