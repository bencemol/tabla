"use client";

import { useBoards, useSearch } from "@/lib/swr";
import { useCreateQueryString } from "@/lib/use-create-query-string";
import { useDebounce } from "@/lib/use-debounce";
import { IconLayoutBoard, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Spinner from "../spinner/Spinner";
import ListNav from "./ListNav";
import SearchResult from "./SearchResult";

export default function GlobalSearch({
  className = "",
}: {
  className?: string;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const createQueryString = useCreateQueryString();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";
  const [queryState, setQueryState] = useState(query);
  const debouncedQuery = useDebounce(queryState, 500);
  const { data, isLoading } = useSearch(debouncedQuery);

  const updateSearchParam = useCallback(
    (q: string) => {
      if (query === q) {
        return;
      }
      const queryString = createQueryString("q", q.length === 0 ? null : q);
      router.replace(`/boards/search?${queryString}`, {
        forceOptimisticNavigation: true,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createQueryString, router]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const query = e.target.value.trim().replace(/\s\s+/g, " ");
    setQueryState(query);
  };

  const preventArrowUpDown: KeyboardEventHandler = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
    }
  };

  useEffect(
    () => updateSearchParam(debouncedQuery),
    [debouncedQuery, updateSearchParam]
  );

  useEffect(() => {
    if (query !== debouncedQuery) {
      setQueryState(query);
      searchInputRef.current!.value = query;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={className} data-active={queryState.length > 0}>
      <ListNav data={data}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <span className="absolute left-0 mx-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoading ? <Spinner /> : <IconSearch />}
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for Boards, Tasks, Descriptions..."
              className="max-w-full py-3 pl-12"
              defaultValue={queryState}
              onChange={handleChange}
              onKeyDown={preventArrowUpDown}
              autoFocus
            ></input>
          </div>
        </form>
        <div className="mt-8 space-y-8">
          {(!debouncedQuery.length || !data?.length) && <RecentBoards />}
          {debouncedQuery.length > 0 &&
            data?.map((board) => (
              <SearchResult
                key={board.id}
                query={debouncedQuery}
                board={board}
              />
            ))}
        </div>
      </ListNav>
    </section>
  );
}

function RecentBoards() {
  const { data, isLoading } = useBoards();

  return isLoading ? null : (
    <div>
      <p>Check out your recent Boards:</p>
      <div className="mt-8 space-y-8">
        {data?.map((board) => (
          <div
            key={board.id}
            className="p-4 grid grid-flow-row border-2 border-t-8 rounded-md"
          >
            <Link
              href={`/boards/${board.id}`}
              className="rounded-md p-2 hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 transition-colors"
            >
              <h2 className="flex items-center gap-2">
                <IconLayoutBoard className="shrink-0" />
                <span>{board.name}</span>
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
