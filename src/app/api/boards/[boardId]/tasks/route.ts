import { db } from "@/lib/db";
import { Task, TaskCreateInput, TaskUpdateInput } from "@/models/Task";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
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
  const body = await request.json();
  const data = TaskCreateInput.parse(body);
  if (!data.stateId) {
    const firstState = await db.taskState.findFirstOrThrow({
      where: { boardId },
      orderBy: { order: "asc" },
    });
    data.stateId = firstState.id;
  }
  const task = await db.task.create({
    data: {
      ...data,
      stateId: data.stateId!,
      boardId,
    },
  });
  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  const body = await request.json();
  const data = TaskUpdateInput.array().parse(body);
  const tasks = await db.$transaction(
    data.map((task) =>
      db.task.update({ where: { id: task.id }, data: { ...task, boardId } })
    )
  );
  return NextResponse.json(tasks);
}
