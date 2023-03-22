"use client";

import CreateTask from "@/components/board/CreateTask";
import Button from "@/components/button/Button";
import Popover from "@/components/popover/Popover";
import BoardsNav from "@/components/sidebar/BoardsNav";
import { Board } from "@prisma/client";
import { IconChevronDown, IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import ContextMenu from "../popover/ContextMenu";
import CreateBoard from "./CreateBoard";

type HeaderProps = {
  board: Board;
  boards: Board[];
};

export default function Header({ board, boards }: HeaderProps) {
  return (
    <header className="grid grid-flow-col justify-between items-center auto-cols-max align-top p-4 border-b-2 border-neutral-100 dark:border-neutral-800">
      <Title board={board} className="hidden sm:flex items-center" />
      <MobileNav board={board} boards={boards} className="block sm:hidden" />
      <section className="flex gap-3">
        <CreateTask className="" boardId={board.id} />
        <ContextMenu>
          <nav>
            <ul>
              <Link
                href={`/boards/${board.id}/edit`}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors`}
              >
                <IconPencil />
                Edit board
              </Link>
            </ul>
          </nav>
        </ContextMenu>
      </section>
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
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((isOpen) => !isOpen);
  return (
    <Button variant="flat" onClick={toggle} className={className}>
      <Title board={board} />
      <IconChevronDown />
      <Popover isOpen={isOpen} onClick={toggle}>
        <CreateBoard className="w-full !bg-transparent hover:!bg-neutral-100 dark:hover:!bg-neutral-700" />
        <div className="my-1 border-b-2 border-inherit"></div>
        <BoardsNav
          boards={boards}
          linkClassName="data-[active=true]:!bg-transparent data-[active=true]:hover:!bg-neutral-100 data-[active=true]:dark:hover:!bg-neutral-700"
        />
      </Popover>
    </Button>
  );
};
