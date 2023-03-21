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
  return (
    <header className="grid grid-flow-col justify-between items-center auto-cols-max align-top p-4 border-b-2 border-neutral-100 dark:border-neutral-800">
      <Title board={board} className="hidden sm:flex items-center" />
      <MobileNav board={board} boards={boards} className="block sm:hidden" />
      <CreateTask className="" boardId={board.id} />
    </header>
  );
}

const Title = ({
  board,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  board: Board;
}) => (
  <h1 className={className} {...props}>
    {board.name}
  </h1>
);

const MobileNav = ({
  board,
  boards,
  className,
}: React.HTMLAttributes<HTMLElement> & { board: Board; boards: Board[] }) => {
  const [isBoardNavOpen, setIsBoardNavOpen] = useState(false);
  const toggleBoardNav = () => setIsBoardNavOpen((isOpen) => !isOpen);
  return (
    <Button variant="flat" onClick={toggleBoardNav} className={className}>
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
