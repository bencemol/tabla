import { Task } from "@prisma/client";
import useSWR from "swr";

const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export function useTasks(boardId: string) {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    `/api/boards/${boardId}/tasks`,
    fetcher
  );

  return {
    data,
    mutate,
    isLoading,
    error,
  };
}
