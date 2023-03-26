import Columns from "@/components/board/Columns";
import Header from "@/components/board/Header";
import { getServerSessionUser, isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board } from "@/models/Board";
import { Task } from "@/models/Task";
import { TaskState } from "@/models/TaskState";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

async function getBoards() {
  const user = await getServerSessionUser();
  const data = await db.board.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return Board.array().parse(data);
}

async function getBoard(id: string) {
  if (!(await isAuthorized(id))) {
    redirect("/403");
  }
  const board = await db.board.findUnique({ where: { id } });
  if (!board) {
    notFound();
  }
  return Board.parse(board);
}

async function getStates(boardId: string) {
  if (!(await isAuthorized(boardId))) {
    redirect("/403");
  }
  const data = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
  });
  return TaskState.array().parse(data);
}

async function getTasks(boardId: string) {
  if (!(await isAuthorized(boardId))) {
    redirect("/403");
  }
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
        className="flex-grow px-4"
        boardId={boardId}
        states={states}
        tasks={tasks}
      />
      {children}
    </section>
  );
}
