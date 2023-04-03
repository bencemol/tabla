import { BoardWithTasks } from "@/models/board";
import Link from "next/link";
import Highlight from "./Highlight";
import { IconCheckbox, IconLayoutBoard } from "@tabler/icons-react";
import { Separator } from "../separator/Separator";
import { Fragment } from "react";

type SearchResultProps = {
  board: BoardWithTasks;
  query: string;
};

export default function SearchResult({ board, query }: SearchResultProps) {
  const regex = new RegExp(/\b\w+\b/gi);
  const startsWithRegex = query
    .replaceAll(/[^\w\s]/g, "")
    .replaceAll(" ", "|")
    .replaceAll(regex, (match) => `\\b${match}`);

  return (
    <div className="p-4 grid grid-flow-row border-2 border-t-8 rounded-md text-zinc-800 dark:text-zinc-200">
      <Link
        href={`/boards/${board.id}`}
        className="rounded-md p-2 hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 transition-colors"
      >
        <h2 className="flex items-center gap-2">
          <IconLayoutBoard />
          <span>
            <Highlight text={board.name} highlight={startsWithRegex} />
          </span>
        </h2>
      </Link>
      {board.tasks.length > 0 && (
        <>
          <Separator />
          <div className="pl-8">
            {board.tasks.map((task, i) => (
              <Fragment key={task.id}>
                <Link
                  href={`/boards/${board.id}/tasks/${task.id}`}
                  className="grid gap-2 grid-flow-row rounded-md p-2 hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 transition-colors"
                >
                  <h3 className="flex items-center gap-2">
                    <IconCheckbox />
                    <span>
                      <Highlight
                        text={task.title}
                        highlight={startsWithRegex}
                      />
                    </span>
                  </h3>
                  <p>
                    <Highlight
                      text={task.description ?? ""}
                      highlight={startsWithRegex}
                      hideOnNoMatch={true}
                    />
                  </p>
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
