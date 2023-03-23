import { TaskState, TaskStateCreateInput } from "@/models/TaskState";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
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
  const body = await request.json();
  const data = TaskStateCreateInput.parse(body);
  const state = await db.taskState.create({
    data: { ...data, boardId },
  });
  return NextResponse.json(state);
}
