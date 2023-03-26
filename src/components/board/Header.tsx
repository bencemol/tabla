"use client";

import Button from "@/components/button/Button";
import Popover from "@/components/popover/Popover";
import BoardsNav from "@/components/sidebar/BoardsNav";
import { Board } from "@/models/Board";
import { IconChevronDown, IconLogout, IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import ContextMenu from "../popover/ContextMenu";
import CreateBoard from "./CreateBoard";
import { CreateTask } from "./CreateTask";
import { signOut } from "next-auth/react";

type HeaderProps = {
  board: Board;
  boards: Board[];
};

export default function Header({ board, boards }: HeaderProps) {
  return (
    <header className="grid grid-flow-col gap-2 justify-between items-center auto-cols-auto align-top p-4 border-b-2 border-zinc-100 dark:border-zinc-800">
      <Title board={board} className="hidden sm:block items-center" />
      <MobileNav
        board={board}
        boards={boards}
        className="block sm:hidden min-w-0 -ml-3"
      />
      <section className="flex gap-3">
        <CreateTask className="" boardId={board.id} />
        <ContextMenu>
          <Link
            href={`/boards/${board.id}/edit`}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors`}
          >
            <IconPencil />
            Edit Board
          </Link>
          <div className="my-1 border-b-2 border-inherit"></div>
          <Button
            variant="flat"
            className="w-full hover:!bg-zinc-100 dark:hover:!bg-zinc-700"
            onClick={() => signOut()}
          >
            <IconLogout />
            Sign Out
          </Button>
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
  <h1
    className={`whitespace-nowrap overflow-hidden text-ellipsis min-w-0 ${className}`}
    {...props}
  >
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
      <IconChevronDown className="shrink-0" />
      <Popover isOpen={isOpen} onClick={toggle}>
        <CreateBoard
          className="w-full !border-none !text-inherit !translate-y-0 !bg-transparent hover:!bg-zinc-100 dark:hover:!bg-zinc-700"
          onClose={() => setIsOpen(false)}
        />
        <div className="my-1 border-b-2 border-inherit"></div>
        <BoardsNav
          boards={boards}
          linkClassName="data-[active=true]:!bg-transparent data-[active=true]:hover:!bg-zinc-100 data-[active=true]:dark:hover:!bg-zinc-700"
        />
      </Popover>
    </Button>
  );
};
