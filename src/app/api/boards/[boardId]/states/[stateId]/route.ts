import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string; stateId: string };
};

export async function PATCH(
  request: NextRequest,
  { params: { stateId } }: Options
) {
  const data: Prisma.TaskStateUpdateInput = await request.json();
  const state = await db.taskState.update({
    where: { id: stateId },
    data: { ...data, id: stateId },
  });
  return NextResponse.json(state);
}

export async function DELETE(_: NextRequest, { params: { stateId } }: Options) {
  await db.taskState.delete({ where: { id: stateId } });
  return NextResponse.json(null);
}
