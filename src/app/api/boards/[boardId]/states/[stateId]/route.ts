import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

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
  return new Response(JSON.stringify(state), { status: 200, statusText: "Ok" });
}

export async function DELETE(_: NextRequest, { params: { stateId } }: Options) {
  await db.taskState.delete({ where: { id: stateId } });
  return new Response(null, { status: 200, statusText: "Ok" });
}
