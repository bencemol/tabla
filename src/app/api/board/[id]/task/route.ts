import { db } from "@/app/db";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const task = await db.task.create({ data: { ...data, boardId: params.id } });
  return new Response(JSON.stringify(task), {
    status: 201,
    statusText: "Created",
  });
}
