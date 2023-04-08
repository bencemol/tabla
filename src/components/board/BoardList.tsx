"use client";

import { easeOut } from "@/lib/easing";
import { useBoards } from "@/lib/swr";
import { useRef } from "react";
import BoardCard from "./BoardCard";
import CreateBoardInline from "./CreateBoardInline";

export default function BoardList() {
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
    <div className="space-y-12">
      <p>Here&apos;s a list of all your Boards ({data?.length}):</p>
      <CreateBoardInline
        ref={formRef}
        className="w-full justify-center"
        onToggle={animateList}
      />
      <div ref={listRef} className="space-y-12">
        {data?.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}
