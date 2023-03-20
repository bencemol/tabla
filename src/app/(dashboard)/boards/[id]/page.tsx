import { db } from "@/app/db";
import Columns from "@/components/board/Columns";
import CreateTask from "@/components/task/CreateTask";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getBoard(id: string) {
  const board = await db.board.findUnique({ where: { id } });
  if (!board) {
    notFound();
  }
  return board;
}

function getTasks(boardId: string) {
  return db.task.findMany({
    where: { boardId },
    orderBy: { priority: "asc" },
  });
}

async function generateTasks() {
  const board = await db.board.findFirst({ where: { name: "board 3" } });
  if (!board) {
    return;
  }
  const tasks: {
    boardId: string;
    title: string;
    description: string;
    state: "TODO";
  }[] = [];
  for (let i = 0; i < 1000; i++) {
    tasks.push({
      boardId: board.id,
      title: `task ${i}`,
      description: `description ${i}`,
      state: "TODO",
    });
  }
  await db.task.createMany({ data: tasks });
}

type BoardProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: BoardProps): Promise<Metadata> {
  const board = await getBoard(params.id);
  return {
    title: board.name,
  };
}

export default async function Board({ params }: BoardProps) {
  const [board, tasks] = await Promise.all([
    getBoard(params.id),
    getTasks(params.id),
  ]);

  return (
    <section className="grow flex flex-col max-h-screen">
      <section className="flex align-top p-4 pb-6 border-b-2 border-neutral-100 dark:border-neutral-800">
        <h1>{board.name}</h1>
        <CreateTask className="ml-auto" boardId={params.id} />
      </section>
      <Columns
        className="flex-grow mt-4 px-4"
        boardId={params.id}
        tasks={tasks}
      />
    </section>
  );
}
