import { db } from "@/app/db";
import CreateBoard from "@/components/board/CreateBoard";
import { IconLayoutBoard } from "@tabler/icons-react";
import ActiveLink from "./ActiveLink";

function getBoards() {
  return db.board.findMany();
}

export default async function Sidebar() {
  const boards = await getBoards();

  return (
    <aside className="h-full p-4 border-r-2 border-neutral-100 bg-white dark:border-emerald-900/30 dark:bg-neutral-900/20">
      <h1 className="mb-6">logo comes here</h1>
      <h5 className="mb-5">All boards ({boards.length})</h5>
      <nav>
        <ul className="grid gap-1">
          {boards.map(({ id, name }) => (
            <li key={id}>
              <ActiveLink
                href={`/board/${id}`}
                className="flex gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                activeClassName="bg-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              >
                <IconLayoutBoard />
                {name}
              </ActiveLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-1">
        <CreateBoard />
      </div>
    </aside>
  );
}
