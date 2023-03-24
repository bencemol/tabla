import { isAuthorized } from "@/lib/auth";
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
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
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
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  await db.board.delete({ where: { id: boardId } });
  return NextResponse.json(null);
}
