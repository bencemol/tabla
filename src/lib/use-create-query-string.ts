import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useCreateQueryString() {
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  return createQueryString;
}
