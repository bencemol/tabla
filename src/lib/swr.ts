import { Board, BoardWithTasks } from "@/models/board";
import { Task } from "@/models/task";
import { TaskState } from "@/models/task-state";
import useSWR from "swr";

const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export function useBoards() {
  const { data, error, isLoading, mutate } = useSWR<Board[]>(
    "/api/boards",
    fetcher
  );

  return {
    data,
    mutate,
    isLoading,
    error,
  };
}

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

export function useSearch(query: string) {
  const { data, error, isLoading, mutate } = useSWR<BoardWithTasks[]>(
    () => {
      const noSpecialQuery = query.replaceAll(/[^\w\s]/g, "");
      return noSpecialQuery.length > 1 ? `/api/search${query}` : null;
    },
    () => {
      const startsWithQuery = query
        .replaceAll(/[^\w\s]/g, "")
        .replaceAll(/\b\w+\b/g, (match) => `${match}*`);
      return fetcher("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: startsWithQuery }),
      });
    }
  );

  return {
    data,
    mutate,
    isLoading,
    error,
  };
}
