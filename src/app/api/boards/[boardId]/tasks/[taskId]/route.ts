import { db } from "@/lib/db";
import { Task, TaskUpdateInput } from "@/models/Task";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: {
    boardId: string;
    taskId: string;
  };
};

export async function GET(_: NextRequest, { params: { taskId } }: Options) {
  const data = await db.task.findUniqueOrThrow({ where: { id: taskId } });
  const task = Task.parse(data);
  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params: { taskId } }: Options
) {
  const body = await request.json();
  const data = TaskUpdateInput.parse(body);
  const task = await db.task.update({
    where: { id: taskId },
    data,
  });
  return NextResponse.json(task);
}

export async function DELETE(_: NextRequest, { params: { taskId } }: Options) {
  await db.task.delete({ where: { id: taskId } });
  return NextResponse.json(null);
}
