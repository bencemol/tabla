import { db } from "@/lib/db";
import { NextRequest } from "next/server";

type Options = {
  params: {
    boardId: string;
    taskId: string;
  };
};

export async function GET(_: NextRequest, { params: { taskId } }: Options) {
  const task = await db.task.findUnique({ where: { id: taskId } });
  return new Response(JSON.stringify(task), { status: 200, statusText: "Ok" });
}

export async function PATCH(
  request: NextRequest,
  { params: { boardId, taskId } }: Options
) {
  const data = await request.json();
  const task = await db.task.update({
    where: { id: taskId },
    data: { ...data, boardId },
  });
  return new Response(JSON.stringify(task), { status: 200, statusText: "Ok" });
}

export async function DELETE(_: NextRequest, { params: { taskId } }: Options) {
  await db.task.delete({ where: { id: taskId } });
  return new Response(null, { status: 200, statusText: "Ok" });
}
