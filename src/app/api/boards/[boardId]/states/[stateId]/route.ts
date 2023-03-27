import { isAuthorized } from "@/lib/auth";
import { TaskState, TaskStateUpdateInput } from "@/models/task-state";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string; stateId: string };
};

export async function PATCH(
  request: NextRequest,
  { params: { boardId, stateId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskStateUpdateInput.parse(body);
  const updatedState = await db.taskState.update({
    where: { id: stateId },
    data,
  });
  const state = TaskState.parse(updatedState);
  return NextResponse.json(state);
}

export async function DELETE(
  _: NextRequest,
  { params: { boardId, stateId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  await db.taskState.delete({ where: { id: stateId } });
  return NextResponse.json(null);
}
