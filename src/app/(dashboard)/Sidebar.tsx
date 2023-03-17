import { db } from "@/app/db";
import Link from "next/link";

function getBoards() {
  return db.board.findMany();
}

export default async function Sidebar() {
  const boards = await getBoards();

  return (
    <aside className="h-full p-6 bg-white dark:bg-slate-700">
      <h1 className="mb-6">logo comes here</h1>
      <h4 className="mb-5">All boards ({boards.length})</h4>
      <nav>
        <ul>
          {boards.map(({ id, name }) => (
            <li key={id}>
              <Link href={`/board/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
