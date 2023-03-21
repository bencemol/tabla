import { db } from "@/app/db";
import { NextRequest } from "next/server";

type Options = {
  params: {
    boardId: string;
    taskId: string;
  };
};

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