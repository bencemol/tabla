import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const board = await db.board.create({ data });
  await addDefaultStates(board.id);
  return new Response(JSON.stringify(board), {
    status: 201,
    statusText: "Created",
  });
}

const defaultStates = ["todo", "in progress", "done"];

async function addDefaultStates(boardId: string) {
  const states: Prisma.TaskStateCreateManyInput[] = defaultStates.map(
    (name) => ({ boardId, name })
  );
  await db.taskState.createMany({ data: states });
}
