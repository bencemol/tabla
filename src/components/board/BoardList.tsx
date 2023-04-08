"use client";

import { easeOut } from "@/lib/easing";
import { useBoards, useTaskStates } from "@/lib/swr";
import { Board } from "@/models/board";
import Link from "next/link";
import { useRef } from "react";
import { SWRConfig } from "swr";
import { Separator } from "../separator/Separator";
import CreateBoardInline from "./CreateBoardInline";

type BoardListProps = {
  boards: Board[];
};

export default function BoardList({ boards }: BoardListProps) {
  const fallback = {
    ["/api/boards"]: boards,
  };
  const { data } = useBoards();
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLElement>(null);

  const animateList = (isOpen: boolean) => {
    const list = listRef.current;
    const formRect = formRef.current?.getBoundingClientRect();
    if (!list || !formRect) {
      return;
    }
    const { height } = formRect;
    const options: KeyframeAnimationOptions = {
      duration: 150,
      easing: easeOut,
    };
    if (isOpen) {
      list.animate(
        [
          { transform: `translateY(-${height / 3}px)` },
          { transform: "translateY(0)" },
        ],
        options
      );
    } else {
      list.animate(
        [
          { transform: `translateY(${height}px)` },
          { transform: "translateY(0)" },
        ],
        options
      );
    }
  };

  return (
    <SWRConfig value={{ fallback }}>
      <div className="space-y-12">
        <p>Here&apos;s a list of all your Boards ({data?.length}):</p>
        <CreateBoardInline
          ref={formRef}
          className="w-full justify-center"
          onToggle={animateList}
        />
        <div ref={listRef} className="space-y-12">
          {data?.map((board) => (
            <Card key={board.id} board={board} />
          ))}
        </div>
      </div>
    </SWRConfig>
  );
}

function Card({ board }: { board: Board }) {
  const { data: states } = useTaskStates(board.id);

  return (
    <Link
      href={`/boards/${board.id}`}
      className="block border-2 border-t-8 space-y-4 rounded-md p-4 shadow-md overflow-hidden text-ellipsis break-words"
    >
      <h2 className="text-center">{board.name}</h2>
      <Separator />
      <div className="flex gap-2 justify-evenly flex-wrap">
        {states?.map((state) => (
          <div
            key={state.id}
            className="uppercase last:text-right max-w-[20ch] shrink"
          >
            {/* TODO move to separate component with SWR */}
            {/* <small className="block whitespace-nowrap text-ellipsis overflow-hidden">
              <strong>{state.tasks.length}</strong> {state.name}
            </small> */}
          </div>
        ))}
      </div>
    </Link>
  );
}
