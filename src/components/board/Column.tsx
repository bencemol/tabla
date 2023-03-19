"use client";

import { useTasks } from "@/app/lib/swr";
import { Task } from "@prisma/client";
import Draggable from "./Draggable";
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
    console.log({ index });
    if (task.state === state && task.priority === index) {
      return;
    }
    task.state = state;
    let updatedTasks = [...tasks.filter(({ id }) => id !== task.id)];
    updatedTasks.splice(index, 0, task);
    updatedTasks = updatedTasks.map((task, priority) => ({
      ...task,
      priority,
    }));
    mutate(
      [
        ...data!.filter((t1) => !tasks.find((t2) => t1.id === t2.id)),
        ...updatedTasks,
      ],
      {
        revalidate: false,
      }
    );
    await fetch(`/api/boards/${boardId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks),
    });
    mutate();
  };
  return (
    <section
      className="flex flex-col"
      key={state}
      style={{ "--drag-over-offset": "59.5px" } as React.CSSProperties}
    >
      <h5 className="mb-3">{state}</h5>
      <ul className="grow">
        {tasks?.map((task, index) => (
          <Draggable
            key={task.id}
            item={task}
            onMove={(d, o) =>
              moveTask(
                d,
                state,
                o === "bottom"
                  ? Math.min(index + 1, tasks.length)
                  : Math.max(index - 1, 0)
              )
            }
          >
            <TaskCard task={task} />
          </Draggable>
        ))}
      </ul>
    </section>
  );
}
