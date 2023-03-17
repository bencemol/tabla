import { db } from "@/app/db";
import { Task } from "@prisma/client";

function getTasks(boardId: string) {
  return db.task.findMany({ where: { boardId } });
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
};

export default async function Columns({ boardId }: BoardProps) {
  const columns = await getTasks(boardId).then(groupTasksByState);
  return (
    <section className="h-full grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] gap-3 overflow-auto">
      {Array.from(columns.keys()).map((status) => (
        <section key={status}>
          <h4 className="mt-4 mb-3">{status}</h4>
          <section className="flex flex-col gap-3">
            {columns.get(status)?.map((task) => (
              <article className="p-2 bg-slate-300 rounded" key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </article>
            ))}
          </section>
        </section>
      ))}
    </section>
  );
}