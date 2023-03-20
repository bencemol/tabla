"use client";

import Button from "@/components/button/Button";
import Popover from "@/components/popover/Popover";
import BoardsNav from "@/components/sidebar/BoardsNav";
import CreateTask from "@/components/task/CreateTask";
import { Board } from "@prisma/client";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

type HeaderProps = {
  board: Board;
  boards: Board[];
};

export default function Header({ board, boards }: HeaderProps) {
  const [isBoardNavOpen, setIsBoardNavOpen] = useState(false);
  const toggleBoardNav = () => setIsBoardNavOpen((isOpen) => !isOpen);

  return (
    <header className="flex align-top p-4 border-b-2 border-neutral-100 dark:border-neutral-800">
      <Button variant="flat" onClick={toggleBoardNav}>
        <h1>{board.name}</h1>
        <IconChevronDown />
        <Popover isOpen={isBoardNavOpen}>
          <BoardsNav
            boards={boards}
            linkClassName="data-[active=true]:!bg-transparent data-[active=true]:hover:!bg-neutral-100 data-[active=true]:dark:hover:!bg-neutral-700"
          />
        </Popover>
      </Button>
      <CreateTask className="ml-auto" boardId={board.id} />
    </header>
  );
}
