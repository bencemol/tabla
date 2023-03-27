import { Task } from "@/models/task";
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

export function useTask(boardId: string, taskId: string) {
  const { data, error, isLoading, mutate } = useSWR<Task>(
    `/api/boards/${boardId}/tasks/${taskId}`,
    fetcher,
    { suspense: true }
  );

  return {
    data,
    mutate,
    isLoading,
    error,
  };
}
