import CreateBoard from "@/components/board/CreateBoard";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board } from "@/models/Board";
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
    <aside className="hidden sm:block w-60 h-full p-4 border-r-2 border-neutral-100 dark:border-neutral-800">
      <h1 className="mb-8">Tábla logo here</h1>
      <div className="mb-6">
        <CreateBoard className="w-full" />
      </div>
      <h5 className="mb-2">All boards ({boards.length})</h5>
      <BoardsNav boards={boards} />
    </aside>
  );
}
