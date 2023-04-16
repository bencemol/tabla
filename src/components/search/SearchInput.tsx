"use client";

import { useCreateQueryString } from "@/lib/use-create-query-string";
import { useDebounce } from "@/lib/use-debounce";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";

type SearchInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function SearchInput(props: SearchInputProps) {
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";
  const [queryState, setQueryState] = useState(query);
  const debouncedQuery = useDebounce(queryState, 800);

  const updateSearchParam = useCallback(
    (query: string) => {
      if (query.length === 0) {
        return;
      }
      const queryString = createQueryString("q", query);
      router.push(`/boards/search?${queryString}`);
    },
    [createQueryString, router]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.length < 1) {
      return;
    }
    const query = e.target.value.trim().replace(/\s\s+/g, " ");
    setQueryState(query);
  };

  useEffect(
    () => updateSearchParam(debouncedQuery),
    [debouncedQuery, updateSearchParam]
  );

  const prefetchSearch = () => {
    router.prefetch("/boards/search");
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onMouseEnter={prefetchSearch}
      className="[&:not(:focus-within)]:text-zinc-400 [&:not(:focus-within)]:dark:text-zinc-400"
    >
      <div className="relative">
        <span className="absolute left-0 mx-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder="Search for Boards, Tasks, Descriptions..."
          className="max-w-full py-3 pl-12 [&:not(:focus)]:border-zinc-400 [&:not(:focus)]:dark:border-zinc-800"
          onChange={handleChange}
          {...props}
        ></input>
      </div>
    </form>
  );
}
