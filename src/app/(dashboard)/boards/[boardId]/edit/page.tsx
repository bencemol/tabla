import EditBoard from "@/components/board/EditBoard";
import { BoardWithTasks } from "@/models/Board";
import { notFound } from "next/navigation";

async function getBoard(id: string) {
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
