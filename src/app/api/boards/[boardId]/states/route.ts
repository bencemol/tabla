import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
  const states = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
  });
  return new Response(JSON.stringify(states), {
    status: 200,
    statusText: "Ok",
  });
}

export async function POST(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  const data: Prisma.TaskStateUncheckedCreateWithoutTasksInput =
    await request.json();
  const state = await db.taskState.create({
    data: { ...data, boardId },
  });
  return new Response(JSON.stringify(state), {
    status: 201,
    statusText: "Created",
  });
}
