import EditBoard from "@/components/board/EditBoard";
import { isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { BoardWithTasks } from "@/models/Board";
import { notFound, redirect } from "next/navigation";

async function getBoard(id: string) {
  if (!(await isAuthorized(id))) {
    redirect("/");
  }
  const data = await db.board.findUnique({
    where: { id },
    include: { tasks: true },
  });
  return BoardWithTasks.parse(data);
}

type EditBoardProps = {
  params: {
    boardId: string;
  };
};

export default async function Board({ params: { boardId } }: EditBoardProps) {
  const board = await getBoard(boardId);
  if (!board) {
    notFound();
  }

  return <EditBoard board={board} />;
}
