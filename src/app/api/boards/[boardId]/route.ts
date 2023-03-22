import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

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
  return new Response(JSON.stringify(task), { status: 200, statusText: "Ok" });
}

export async function DELETE(_: NextRequest, { params: { boardId } }: Options) {
  await db.board.delete({ where: { id: boardId } });
  return new Response(null, { status: 200, statusText: "Ok" });
}
