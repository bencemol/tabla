import { db } from "@/app/db";
import { NextRequest } from "next/server";

type Options = {
  params: { boardId: string };
};

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
