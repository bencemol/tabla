import { isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { Task, TaskCreateInput, TaskUpdateManyInput } from "@/models/task";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const data = await db.task.findMany({
    where: { boardId },
    orderBy: { priority: "asc" },
  });
  const tasks = Task.array().parse(data);
  return NextResponse.json(tasks);
}

export async function POST(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskCreateInput.parse(body);
  if (!data.stateId) {
    const firstState = await db.taskState.findFirstOrThrow({
      where: { boardId },
      orderBy: { order: "asc" },
    });
    data.stateId = firstState.id;
  }
  const createdTask = await db.task.create({
    data: {
      ...data,
      stateId: data.stateId!,
      boardId,
    },
  });
  const task = Task.parse(createdTask);
  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskUpdateManyInput.parse(body);
  const updatedTasks = await db.$transaction(
    data.map((task) =>
      db.task.update({ where: { id: task.id }, data: { ...task, boardId } })
    )
  );
  const tasks = Task.array().parse(updatedTasks);
  return NextResponse.json(tasks);
}
