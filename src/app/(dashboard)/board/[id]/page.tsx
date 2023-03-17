import { db } from "@/app/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Columns from "./Columns";

async function getBoard(id: string) {
  const board = await db.board.findUnique({ where: { id } });
  if (!board) {
    notFound();
  }
  return board;
}

type BoardProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: BoardProps): Promise<Metadata> {
  const board = await getBoard(params.id);
  return {
    title: board.name,
  };
}

export default async function Board({ params }: BoardProps) {
  const board = await getBoard(params.id);
  return (
    <section className="flex flex-col bg-slate-100">
      <h1 className="m-4 mb-6">{board.name}</h1>
      {/* @ts-expect-error Async Server Component */}
      <Columns className="flex-grow px-4" boardId={board.id} />
    </section>
  );
}
