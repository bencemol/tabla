import { Task } from "@/models/task";
import { TaskState } from "@/models/task-state";
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

export function useTaskStates(boardId: string, fallbackData?: TaskState[]) {
  const { data, error, isLoading, mutate } = useSWR<TaskState[]>(
    `/api/boards/${boardId}/states`,
    fetcher,
    { fallbackData }
  );

  return {
    data,
    mutate,
    isLoading,
    error,
  };
}
