import { isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { Search } from "@/models/search";
import { Task } from "@/models/task";
import { NextRequest, NextResponse } from "next/server";

type Options = {
  params: { boardId: string };
};

export async function POST(req: NextRequest, { params: { boardId } }: Options) {
  if (!(await isAuthorized(boardId))) {
    return NextResponse.json(null, { status: 403, statusText: "Forbidden" });
  }
  const body = await req.json();
  const { query: search } = Search.parse(body);
  const data = await db.task.findMany({
    where: {
      AND: [{ boardId }, { title: { search }, description: { search } }],
    },
  });
  const boards = Task.array().parse(data);
  return NextResponse.json(boards);
}
