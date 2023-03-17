import { Board } from "@prisma/client";
import Link from "next/link";

type SidebarProps = {
  boards: Board[];
};

export default function Sidebar({ boards }: SidebarProps) {
  return (
    <div className="h-full p-6 bg-white dark:bg-slate-700">
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
    </div>
  );
}
