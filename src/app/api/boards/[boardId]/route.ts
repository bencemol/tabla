import { db } from "@/lib/db";
import { Board, BoardUpdateInput } from "@/models/Board";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: {
    boardId: string;
  };
};

export async function PATCH(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  const body = await request.json();
  const data = BoardUpdateInput.parse(body);
  const updatedBoard = await db.board.update({
    where: { id: boardId },
    data,
  });
  const board = Board.parse(updatedBoard);
  return NextResponse.json(board);
}

export async function DELETE(_: NextRequest, { params: { boardId } }: Options) {
  await db.board.delete({ where: { id: boardId } });
  return NextResponse.json(null);
}
