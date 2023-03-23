import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const board = await db.board.create({ data });
  await addDefaultStates(board.id);
  return NextResponse.json(board);
}

const defaultStates = ["todo", "in progress", "done"];

async function addDefaultStates(boardId: string) {
  const states: Prisma.TaskStateCreateManyInput[] = defaultStates.map(
    (name) => ({ boardId, name })
  );
  await db.taskState.createMany({ data: states });
}
