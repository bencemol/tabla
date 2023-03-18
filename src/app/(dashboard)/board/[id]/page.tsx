import { db } from "@/app/db";
import Columns from "@/components/board/Columns";
import CreateTask from "@/components/task/CreateTask";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
    <section className="flex flex-col">
      <section className="flex align-top p-4 pb-6 border-b-2 border-neutral-100">
        <h1>{board.name}</h1>
        <CreateTask className="ml-auto" boardId={params.id} />
      </section>
      {/* @ts-expect-error Async Server Component */}
      <Columns className="flex-grow mt-4 px-4" boardId={board.id} />
    </section>
  );
}
