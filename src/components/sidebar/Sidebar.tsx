"use client";

/* eslint-disable @next/next/no-img-element */
import CreateBoard from "@/components/board/CreateBoard";
import { useBoards } from "@/lib/swr";
import Link from "next/link";
import Logo from "../logo/Logo";
import BoardsNav from "./BoardsNav";

export default function Sidebar() {
  const { data: boards } = useBoards();

  return (
    <aside className="hidden sm:flex flex-col w-60 h-full max-h-screen overflow-hidden p-4 sticky top-0 border-r-2 border-zinc-100 dark:border-zinc-800">
      <Link href="/boards" className="block mb-10 mt-1" tabIndex={-1}>
        <Logo variant="full" />
      </Link>
      <div className="mb-6">
        <CreateBoard className="w-full" />
      </div>
      <BoardsNav
        boards={boards ?? []}
        className="overflow-x-auto"
        linkClassName="mb-1"
      />
    </aside>
  );
}
