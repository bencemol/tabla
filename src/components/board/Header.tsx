/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/button/Button";
import Popover from "@/components/popover/Popover";
import BoardsNav from "@/components/sidebar/BoardsNav";
import { Board } from "@/models/board";
import {
  IconChevronDown,
  IconLogout,
  IconPencil,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Logo from "../logo/Logo";
import { Separator } from "../separator/Separator";
import CreateBoard from "./CreateBoard";
import { CreateTask } from "./CreateTask";

type HeaderProps = {
  session?: Session;
  board?: Board;
  boards?: Board[];
  className?: string;
};

export default function Header({
  session,
  board,
  boards,
  className = "",
}: HeaderProps) {
  return (
    <SessionProvider session={session}>
      <header
        className={`grid grid-flow-col gap-2 items-center grid-cols-[minmax(0,1fr)_auto_min-content] p-4 border-b-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${className}`}
      >
        {board && boards && (
          <>
            <Title board={board} className="hidden sm:block items-center" />
            <MobileNav
              board={board}
              boards={boards}
              className="block sm:hidden min-w-0 -ml-3 max-w-min"
            />
            <section className="ml-auto flex gap-3">
              <CreateTask className="" boardId={board.id} />
              <Link
                href={`/boards/${board.id}/edit`}
                className={`p-2 border-2 border-black dark:border-white rounded-md active:translate-y-0.5 transition-transform`}
              >
                <IconPencil />
              </Link>
              <Link
                href="/boards/search"
                className={`hidden sm:block p-2 border-2 border-black dark:border-white rounded-md active:translate-y-0.5 transition-transform`}
              >
                <IconSearch />
              </Link>
            </section>
          </>
        )}
        {!board && !boards && (
          <>
            <Logo className="sm:invisible mr-auto" />
            <Link
              href="/boards/search"
              className="p-2 border-2 border-black dark:border-white rounded-md active:translate-y-0.5 transition-transform"
            >
              <IconSearch />
            </Link>
          </>
        )}
        <ProfileMenu className="ml-1 col-start-3 self-end" />
      </header>
    </SessionProvider>
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
        <Separator />
        <BoardsNav
          boards={boards}
          linkClassName="data-[active=true]:!bg-transparent data-[active=true]:hover:!bg-zinc-100 data-[active=true]:dark:hover:!bg-zinc-700"
        />
      </Popover>
    </Button>
  );
};

const ProfileMenu = ({ className = "" }: { className?: string }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((isOpen) => !isOpen);

  return (
    <button
      type="button"
      className={`relative m-auto h-12 aspect-square rounded-full border-2 border-black dark:border-white overflow-hidden active:translate-y-0.5 transition-transform ${className}`}
      onClick={toggle}
    >
      <h2 className="absolute m-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {session?.user?.name?.[0]}
      </h2>
      {session?.user?.image && (
        <img
          src={session.user.image}
          alt="Profile picture"
          className="relative"
        />
      )}
      <Popover isOpen={isOpen} onClick={toggle} pos="bottom-right">
        <p className="p-2 flex items-center gap-2 opacity-60">
          <IconUser />
          {session?.user?.name}
        </p>
        <Separator />
        <Button
          variant="flat"
          className="w-full hover:!bg-zinc-100 dark:hover:!bg-zinc-700"
          onClick={() => signOut()}
        >
          <IconLogout />
          Sign Out
        </Button>
      </Popover>
    </button>
  );
};
