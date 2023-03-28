import { Board } from "@/models/board";
import { IconLayoutBoard, IconLayoutList } from "@tabler/icons-react";
import { Separator } from "../separator/Separator";
import ActiveLink from "./ActiveLink";

type BoardsProps = {
  boards: Board[];
  className?: string;
  linkClassName?: string;
};

export default function BoardsNav({
  boards,
  className = "",
  linkClassName = "",
}: BoardsProps) {
  return (
    <nav className={className}>
      <ul className="grid gap-1">
        <li>
          <ActiveLink
            href="/boards"
            pathMatch="full"
            className={`flex items-center gap-2 p-2 border-2 border-transparent rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors data-[active=true]:bg-zinc-200 data-[active=true]:hover:bg-zinc-200 data-[active=true]:dark:bg-zinc-700 data-[active=true]:dark:hover:bg-zinc-700 ${linkClassName}`}
          >
            <IconLayoutList />
            All Boards ({boards.length})
          </ActiveLink>
        </li>
      </ul>
      <Separator />
      <ul>
        {boards.map(({ id, name }) => (
          <li key={id}>
            <ActiveLink
              href={`/boards/${id}`}
              className={`flex items-center gap-2 p-2 border-2 border-transparent rounded-md [&>*]:min-w-0 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors data-[active=true]:bg-zinc-200 data-[active=true]:hover:bg-zinc-200 data-[active=true]:dark:bg-zinc-700 data-[active=true]:dark:hover:bg-zinc-700 ${linkClassName}`}
            >
              <IconLayoutBoard className="shrink-0" />
              <div className="line-clamp-2 overflow-hidden text-ellipsis break-words">
                {name}
              </div>
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
