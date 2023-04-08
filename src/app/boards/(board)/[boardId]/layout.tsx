import Columns from "@/components/board/Columns";
import { isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board } from "@/models/board";
import { Task } from "@/models/task";
import { TaskState } from "@/models/task-state";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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
  if (!(await isAuthorized(boardId))) {
    redirect("/boards");
  }
  const [states, tasks] = await Promise.all([
    getStates(boardId),
    getTasks(boardId),
  ]);

  return (
    <section className="max-h-[calc(100vh-5rem)] grid grid-rows-1">
      <Columns
        className="mt-4 pb-4 px-4 animate-in fade-in-70"
        boardId={boardId}
        states={states}
        tasks={tasks}
      />
      {children}
    </section>
  );
}
