/* eslint-disable @next/next/no-img-element */
import CreateBoard from "@/components/board/CreateBoard";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board } from "@/models/board";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BoardsNav from "./BoardsNav";

async function getBoards() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }
  const data = await db.board.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return Board.array().parse(data);
}

export default async function Sidebar() {
  const boards = await getBoards();

  return (
    <aside className="hidden sm:block w-60 h-full p-4 border-r-2 border-zinc-100 dark:border-zinc-800">
      <h1 className="mb-8 flex gap-4 items-center">
        <img
          src="/tabla_logo_light.svg"
          alt="Tábla logo"
          className="hidden w-12 aspect-square dark:block"
        />
        <img
          src="/tabla_logo_dark.svg"
          alt="Tábla logo"
          className="w-12 aspect-square dark:hidden"
        />
        <span>Tábla</span>
      </h1>
      <div className="mb-6">
        <CreateBoard className="w-full" />
      </div>
      <BoardsNav boards={boards} />
    </aside>
  );
}
