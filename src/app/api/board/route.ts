import { db } from "@/app/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const board = await db.board.create({ data: data });
  return new Response(JSON.stringify(board), {
    status: 201,
    statusText: "Created",
  });
}
