"use client";

import useMediaQuery from "@/app/lib/media-query";
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
  const isLargerThanMobile = useMediaQuery("(min-width: 640px)");

  return (
    <header className="flex align-top p-4 border-b-2 border-neutral-100 dark:border-neutral-800">
      {isLargerThanMobile ? (
        <Title board={board} />
      ) : (
        <MobileNav board={board} boards={boards} />
      )}
      <CreateTask className="ml-auto" boardId={board.id} />
    </header>
  );
}

const Title = ({ board }: { board: Board }) => <h1>{board.name}</h1>;

const MobileNav = ({ board, boards }: { board: Board; boards: Board[] }) => {
  const [isBoardNavOpen, setIsBoardNavOpen] = useState(false);
  const toggleBoardNav = () => setIsBoardNavOpen((isOpen) => !isOpen);
  return (
    <Button variant="flat" onClick={toggleBoardNav}>
      <Title board={board} />
      <IconChevronDown />
      <Popover isOpen={isBoardNavOpen}>
        <BoardsNav
          boards={boards}
          linkClassName="data-[active=true]:!bg-transparent data-[active=true]:hover:!bg-neutral-100 data-[active=true]:dark:hover:!bg-neutral-700"
        />
      </Popover>
    </Button>
  );
};
