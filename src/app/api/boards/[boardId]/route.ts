import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
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
  const data: Prisma.BoardUpdateInput = await request.json();
  const task = await db.board.update({
    where: { id: boardId },
    data: { ...data, id: boardId },
  });
  return NextResponse.json(task);
}

export async function DELETE(_: NextRequest, { params: { boardId } }: Options) {
  await db.board.delete({ where: { id: boardId } });
  return NextResponse.json(null);
}
