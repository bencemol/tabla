import { getServerSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board, BoardCreateInput } from "@/models/Board";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getServerSessionUser();
  const data = await db.board.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const boards = Board.array().parse(data);
  return NextResponse.json(boards);
}

export async function POST(req: NextRequest) {
  const user = await getServerSessionUser();
  const body = await req.json();
  const data = BoardCreateInput.parse(body);
  const createdBoard = await db.board.create({
    data: { ...data, ownerId: user.id },
  });
  await addDefaultStates(createdBoard.id);
  const board = Board.parse(createdBoard);
  return NextResponse.json(board);
}

const defaultStates = ["todo", "in progress", "done"];

async function addDefaultStates(boardId: string) {
  const states: Prisma.TaskStateCreateManyInput[] = defaultStates.map(
    (name) => ({ boardId, name })
  );
  await db.taskState.createMany({ data: states });
}
