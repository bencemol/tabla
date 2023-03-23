import { db } from "@/lib/db";
import { BoardUpdateInput } from "@/models/Board";
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
  const board = await db.board.update({
    where: { id: boardId },
    data,
  });
  return NextResponse.json(board);
}

export async function DELETE(_: NextRequest, { params: { boardId } }: Options) {
  await db.board.delete({ where: { id: boardId } });
  return NextResponse.json(null);
}
