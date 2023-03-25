import { Board } from "@/models/Board";
import { IconLayoutBoard, IconLayoutList } from "@tabler/icons-react";
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
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors data-[active=true]:bg-neutral-200 data-[active=true]:hover:bg-neutral-200 data-[active=true]:dark:bg-neutral-600 data-[active=true]:dark:hover:bg-neutral-600 ${linkClassName}`}
          >
            <IconLayoutList />
            All Boards ({boards.length})
          </ActiveLink>
        </li>
      </ul>
      <div className="my-1 border-b-2 border-inherit"></div>
      <ul>
        {boards.map(({ id, name }) => (
          <li key={id}>
            <ActiveLink
              href={`/boards/${id}`}
              className={`flex items-center gap-2 p-2 rounded-md [&>*]:min-w-0 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors data-[active=true]:bg-neutral-200 data-[active=true]:hover:bg-neutral-200 data-[active=true]:dark:bg-neutral-600 data-[active=true]:dark:hover:bg-neutral-600 ${linkClassName}`}
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
