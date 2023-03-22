import EditBoard from "@/components/board/EditBoard";
import { notFound } from "next/navigation";

function getBoard(id: string) {
  return db.board.findUnique({ where: { id }, include: { tasks: true } });
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
