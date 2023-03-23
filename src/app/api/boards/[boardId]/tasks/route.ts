import { db } from "@/lib/db";
import { Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
  const tasks = await db.task.findMany({
    where: { boardId },
    orderBy: { priority: "asc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  const data = await request.json();
  if (!data.stateId) {
    const firstState = await db.taskState.findFirstOrThrow({
      where: { boardId: data.boardId },
      orderBy: { order: "asc" },
    });
    data.stateId = firstState.id;
  }
  const task = await db.task.create({
    data: { ...data, boardId },
  });
  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  const data: Task[] = await request.json();
  const tasks = await db.$transaction(
    data.map((task) =>
      db.task.update({ where: { id: task.id }, data: { ...task, boardId } })
    )
  );
  return NextResponse.json(tasks);
}
