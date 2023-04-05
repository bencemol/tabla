import { getServerSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BoardWithTasks } from "@/models/board";
import { Search } from "@/models/search";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getServerSessionUser();
  const body = await req.json();
  const { query: search } = Search.parse(body);
  const data = await db.board.findMany({
    where: {
      AND: [
        { ownerId: user.id },
        {
          OR: [
            { name: { search } },
            { tasks: { some: { title: { search }, description: { search } } } },
          ],
        },
      ],
    },
    include: {
      tasks: { where: { title: { search }, description: { search } }, take: 5 },
    },
    take: 5,
  });
  const boards = BoardWithTasks.array().parse(data);
  return NextResponse.json(boards);
}
