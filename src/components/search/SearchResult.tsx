import { BoardWithTasks } from "@/models/board";
import { IconLayoutBoard } from "@tabler/icons-react";
import Link from "next/link";
import { Fragment } from "react";
import { Separator } from "../separator/Separator";
import Highlight from "./Highlight";

type SearchResultProps = {
  board: BoardWithTasks;
  query?: string;
};

export default function SearchResult({ board, query }: SearchResultProps) {
  const regex = new RegExp(/\b\w+\b/gi);
  const startsWithRegex = query
    ?.replaceAll(/[^\w\s]/g, "")
    .replaceAll(" ", "|")
    .replaceAll(regex, (match) => `\\b${match}`);

  return (
    <div className="p-4 border-2 border-t-8 rounded-md text-zinc-800 dark:text-zinc-200 animate-in slide-in-from-bottom-3">
      <Link
        href={`/boards/${board.id}`}
        className="block rounded-md p-2 hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 transition-colors"
      >
        <h2 className="flex items-center gap-2">
          <IconLayoutBoard className="shrink-0" />
          <span>
            <Highlight text={board.name} highlight={startsWithRegex} />
          </span>
        </h2>
      </Link>
      {board.tasks.length > 0 && (
        <>
          <Separator />
          <div className="pl-10">
            {board.tasks.map((task, i) => (
              <Fragment key={task.id}>
                <Link
                  href={`/boards/${board.id}/tasks/${task.id}`}
                  scroll={false}
                  className="block space-y-2 break-words rounded-md p-2 hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 transition-colors"
                >
                  <h3>
                    <Highlight text={task.title} highlight={startsWithRegex} />
                  </h3>
                  <Highlight
                    text={task.description ?? ""}
                    highlight={startsWithRegex}
                    contextualize={true}
                    hideOnNoMatch={true}
                    wrapper="p"
                  />
                </Link>
                {i < board.tasks.length - 1 && <Separator />}
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
