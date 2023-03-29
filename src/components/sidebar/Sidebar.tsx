/* eslint-disable @next/next/no-img-element */
import CreateBoard from "@/components/board/CreateBoard";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board } from "@/models/board";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Logo from "../logo/Logo";
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
      <Logo className="mb-8 mt-1" />
      <div className="mb-6">
        <CreateBoard className="w-full" />
      </div>
      <BoardsNav boards={boards} />
    </aside>
  );
}
