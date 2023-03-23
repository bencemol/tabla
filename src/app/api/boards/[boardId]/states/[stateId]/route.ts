import { TaskStateUpdateInput } from "@/models/TaskState";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string; stateId: string };
};

export async function PATCH(
  request: NextRequest,
  { params: { stateId } }: Options
) {
  const body = await request.json();
  const data = TaskStateUpdateInput.parse(body);
  const state = await db.taskState.update({
    where: { id: stateId },
    data,
  });
  return NextResponse.json(state);
}

export async function DELETE(_: NextRequest, { params: { stateId } }: Options) {
  await db.taskState.delete({ where: { id: stateId } });
  return NextResponse.json(null);
}
