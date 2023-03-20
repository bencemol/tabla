import { Board } from "@prisma/client";
import { IconLayoutBoard } from "@tabler/icons-react";
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
        {boards.map(({ id, name }) => (
          <li key={id}>
            <ActiveLink
              href={`/boards/${id}`}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors data-[active=true]:bg-neutral-200 data-[active=true]:hover:bg-neutral-200 data-[active=true]:dark:bg-neutral-600 data-[active=true]:dark:hover:bg-neutral-600 ${linkClassName}`}
            >
              <IconLayoutBoard size="1.25rem" stroke={1.625} />
              {name}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
