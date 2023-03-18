import { Task } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

async function getTasks(boardId: string): Promise<Task[]> {
  const tasks = await fetch(`/api/boards/${boardId}/tasks`).then((res) =>
    res.json()
  );
  return tasks;
}

export const useTasks = ({
  boardId,
  select,
  initialTasks,
}: {
  boardId: string;
  select?: (data: Task[]) => Task[];
  initialTasks?: Task[];
}) =>
  useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () => getTasks(boardId),
    initialData: initialTasks,
    select,
  });
