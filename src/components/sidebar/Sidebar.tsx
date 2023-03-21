import { db } from "@/app/db";
import CreateBoard from "@/components/board/CreateBoard";
import BoardsNav from "./BoardsNav";

function getBoards() {
  return db.board.findMany();
}

export default async function Sidebar() {
  const boards = await getBoards();

  return (
    <aside className="hidden sm:block w-60 h-full p-4 border-r-2 border-neutral-100 dark:border-neutral-800">
      <h1 className="mb-8">Tábla logo here</h1>
      <div className="mb-6">
        <CreateBoard />
      </div>
      <h5 className="mb-2">All boards ({boards.length})</h5>
      <BoardsNav boards={boards} />
    </aside>
  );
}