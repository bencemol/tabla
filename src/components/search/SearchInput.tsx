"use client";

import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type SearchInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function SearchInput(props: SearchInputProps) {
  const router = useRouter();

  const prefetchSearch = () => {
    router.prefetch("/boards/search");
  };

  const goToSearch = () => {
    router.push("/boards/search");
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onMouseEnter={prefetchSearch}
      onFocus={goToSearch}
    >
      <div className="relative">
        <span className="absolute left-0 mx-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder="Search for Boards, Tasks, Descriptions..."
          className="max-w-full py-3 pl-12"
          {...props}
        ></input>
      </div>
    </form>
  );
}
