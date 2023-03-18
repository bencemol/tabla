import { db } from "@/app/db";
import Link from "next/link";
import CreateBoard from "@/components/board/CreateBoard";
import { IconLayoutBoard } from "@tabler/icons-react";
import ActiveLink from "./ActiveLink";

function getBoards() {
  return db.board.findMany();
}

export default async function Sidebar() {
  const boards = await getBoards();

  return (
    <aside className="h-full p-4 border-r-2 border-slate-100 bg-white dark:border-emerald-900/30 dark:bg-emerald-900/20">
      <h1 className="mb-6">logo comes here</h1>
      <h5 className="mb-5">All boards ({boards.length})</h5>
      <nav>
        <ul className="grid gap-1">
          {boards.map(({ id, name }) => (
            <li key={id}>
              <ActiveLink
                href={`/board/${id}`}
                className="flex gap-2 p-2 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                activeClassName="bg-emerald-200 hover:bg-emerald-200 dark:bg-emerald-800 dark:hover:bg-emerald-800"
              >
                <IconLayoutBoard />
                {name}
              </ActiveLink>
            </li>
          ))}
        </ul>
      </nav>
      <CreateBoard />
    </aside>
  );
}
