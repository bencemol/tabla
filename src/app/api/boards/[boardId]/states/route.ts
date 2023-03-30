import { isAuthorized } from "@/lib/auth";
import {
  TaskState,
  TaskStateCreateInput,
  TaskStateUpdateManyInput,
} from "@/models/task-state";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function GET(_: NextRequest, { params: { boardId } }: Options) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const data = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
  });
  const states = TaskState.array().parse(data);
  return NextResponse.json(states);
}

export async function POST(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskStateCreateInput.parse(body);
  const createdState = await db.taskState.create({
    data: { ...data, boardId },
  });
  const state = TaskState.parse(createdState);
  return NextResponse.json(state);
}

export async function PATCH(
  request: NextRequest,
  { params: { boardId } }: Options
) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await request.json();
  const data = TaskStateUpdateManyInput.parse(body);
  const updatedStates = await db.$transaction(
    data.map((state) =>
      db.taskState.update({
        where: { id: state.id },
        data: { ...state, boardId },
      })
    )
  );
  const taskStates = TaskState.array().parse(updatedStates);
  return NextResponse.json(taskStates);
}
