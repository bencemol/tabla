import { isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { Task, TaskUpdateInput } from "@/models/Task";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: {
    boardId: string;
    taskId: string;
  };
};

export async function GET(
  _: NextRequest,
  { params: { boardId, taskId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const data = await db.task.findUniqueOrThrow({ where: { id: taskId } });
  const task = Task.parse(data);
  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params: { boardId, taskId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskUpdateInput.parse(body);
  const updatedTask = await db.task.update({
    where: { id: taskId },
    data,
  });
  const task = Task.parse(updatedTask);
  return NextResponse.json(task);
}

export async function DELETE(
  _: NextRequest,
  { params: { boardId, taskId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  await db.task.delete({ where: { id: taskId } });
  return NextResponse.json(null);
}
