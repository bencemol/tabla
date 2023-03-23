import Columns from "@/components/board/Columns";
import Header from "@/components/board/Header";
import { db } from "@/lib/db";
import { Board } from "@/models/Board";
import { Task } from "@/models/Task";
import { TaskState } from "@/models/TaskState";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getBoards() {
  const data = await db.board.findMany({ orderBy: { createdAt: "desc" } });
  return Board.array().parse(data);
}

async function getBoard(id: string) {
  const board = await db.board.findUnique({ where: { id } });
  if (!board) {
    notFound();
  }
  return Board.parse(board);
}

async function getStates(boardId: string) {
  const data = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
  });
  return TaskState.array().parse(data);
}

async function getTasks(boardId: string) {
  const data = await db.task.findMany({
    where: { boardId },
    orderBy: { priority: "asc" },
  });
  return Task.array().parse(data);
}

// async function generateTasks() {
//   const board = await db.board.findFirst({ where: { name: "stress test" } });
//   if (!board) {
//     return;
//   }
//   const tasks: {
//     boardId: string;
//     title: string;
//     description: string;
//     state: "TODO";
//     priority: number;
//   }[] = [];
//   for (let i = 0; i < 4000; i++) {
//     tasks.push({
//       boardId: board.id,
//       title: `task ${i}`,
//       description: `description ${i}`,
//       state: "TODO",
//       priority: i,
//     });
//   }
//   await db.task.createMany({ data: tasks });
// }

type BoardProps = {
  params: {
    boardId: string;
  };
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: BoardProps): Promise<Metadata> {
  const board = await getBoard(params.boardId);
  return {
    title: board.name,
  };
}

export default async function BoardLayout({
  params: { boardId },
  children,
}: BoardProps) {
  const [board, boards, states, tasks] = await Promise.all([
    getBoard(boardId),
    getBoards(),
    getStates(boardId),
    getTasks(boardId),
  ]);

  return (
    <section className="grow flex flex-col max-h-screen">
      <Header board={board} boards={boards} />
      <Columns
        className="flex-grow mt-4 px-4"
        boardId={boardId}
        states={states}
        tasks={tasks}
      />
      {children}
    </section>
  );
}
