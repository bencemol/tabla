"use client";

import { useTaskStates, useTasks } from "@/lib/swr";
import { Board } from "@/models/board";
import { TaskState } from "@/models/task-state";
import Link from "next/link";
import { useMemo } from "react";
import { Separator } from "../separator/Separator";

export default function BoardCard({ board }: { board: Board }) {
  const { data: states, isLoading } = useTaskStates(board.id);

  return (
    <Link
      href={`/boards/${board.id}`}
      className="block border-2 border-t-8 space-y-4 rounded-md p-4 shadow-md overflow-hidden text-ellipsis break-words"
    >
      <h2 className="text-center">{board.name}</h2>
      <Separator />
      <div className="flex gap-2 justify-evenly flex-wrap">
        {isLoading
          ? new Array(3)
              .fill(0)
              .map((_, index) => <GhostColumnStat key={index} />)
          : states?.map((state) => (
              <div
                key={state.id}
                className="uppercase last:text-right max-w-[20ch] shrink"
              >
                <ColumnStat boardId={board.id} state={state} />
              </div>
            ))}
      </div>
    </Link>
  );
}

function ColumnStat({ boardId, state }: { boardId: string; state: TaskState }) {
  const { data: tasksOnBoard, isLoading } = useTasks(boardId);
  const tasks = useMemo(
    () => tasksOnBoard?.filter((task) => task.stateId === state.id) ?? [],
    [tasksOnBoard, state.id]
  );

  return isLoading ? (
    <GhostColumnStat />
  ) : (
    <small className="block whitespace-nowrap text-ellipsis overflow-hidden">
      <strong>{tasks.length}</strong> {state.name}
    </small>
  );
}

function GhostColumnStat() {
  return (
    <small className="block w-16 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
      {"\u00A0"}
    </small>
  );
}
