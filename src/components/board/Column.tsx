"use client";

import { useTasks } from "@/app/lib/swr";
import { Task } from "@prisma/client";
import TaskCard from "./TaskCard";

export default function Column({
  boardId,
  state,
}: {
  boardId: string;
  state: string;
}) {
  const { data, mutate } = useTasks(boardId);
  const tasks = data?.filter((task) => task.state === state) ?? [];
  const moveTask = async (task: Task, state: string, index: number) => {
    if (task.state === state && tasks.indexOf(task) === index) {
      return;
    }
    task.state = state;
    let updatedTasks = [...tasks.filter(({ id }) => id !== task.id)];
    updatedTasks.splice(index, 0, task);
    updatedTasks = updatedTasks.map((task, priority) => ({
      ...task,
      priority,
    }));
    mutate(updatedTasks, { optimisticData: updatedTasks, revalidate: false });
    await fetch(`/api/boards/${boardId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks),
    });
    mutate();
  };
  return (
    <section className="flex flex-col" key={state}>
      <h5 className="mb-3">{state}</h5>
      <section className="grow">
        {tasks?.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={(d) => moveTask(d, state, index)}
            className="mb-3"
          />
        ))}
      </section>
    </section>
  );
}
