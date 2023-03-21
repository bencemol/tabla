import { db } from "@/app/db";
import { Task } from "@prisma/client";
import { NextRequest } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
  const tasks = await db.task.findMany({
    where: { boardId },
    orderBy: { priority: "asc" },
  });
  return new Response(JSON.stringify(tasks), { status: 200, statusText: "Ok" });
}

export async function POST(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  const data = await request.json();
  const task = await db.task.create({ data: { ...data, boardId } });
  return new Response(JSON.stringify(task), {
    status: 201,
    statusText: "Created",
  });
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
  return new Response(JSON.stringify(tasks), {
    status: 200,
    statusText: "Ok",
  });
}
