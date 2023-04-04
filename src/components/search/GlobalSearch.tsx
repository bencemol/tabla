"use client";

import { useBoards, useSearch } from "@/lib/swr";
import { useCreateQueryString } from "@/lib/use-create-query-string";
import { useDebounce } from "@/lib/use-debounce";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Spinner from "../spinner/Spinner";
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
    (query: string) => {
      const queryString = createQueryString(
        "q",
        query.length === 0 ? null : query
      );
      router.push(`/boards/search?${queryString}`, {
        forceOptimisticNavigation: true,
      });
    },
    [createQueryString, router]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const query = e.target.value.trim().replace(/\s\s+/g, " ");
    setQueryState(query);
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
  }, [query]);

  return (
    <section className={className} data-active={queryState.length > 0}>
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
            autoFocus={query.length === 0}
          ></input>
        </div>
      </form>
      <div className="mt-8 space-y-8">
        {!isLoading && data?.length === 0 && <NoResults />}
        {debouncedQuery.length > 0 &&
          data?.map((board) => (
            <SearchResult key={board.id} query={debouncedQuery} board={board} />
          ))}
      </div>
    </section>
  );
}

function NoResults() {
  const { data, isLoading } = useBoards();

  return isLoading ? null : (
    <div>
      <h2 className="text-center animate-in slide-in-from-bottom-3">
        There are no matches for your query 🤔
        <br />
        Check out your recent Boards:
      </h2>
      <div className="mt-8 space-y-8">
        {data?.map((board) => (
          <SearchResult key={board.id} board={{ ...board, tasks: [] }} />
        ))}
      </div>
    </div>
  );
}
