import { isAuthorized } from "@/lib/auth";
import { TaskState, TaskStateCreateInput } from "@/models/task-state";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const data = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
  });
  const states = TaskState.array().parse(data);
  return NextResponse.json(states);
}

export async function POST(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskStateCreateInput.parse(body);
  const createdState = await db.taskState.create({
    data: { ...data, boardId },
  });
  const state = TaskState.parse(createdState);
  return NextResponse.json(state);
}
