"use client";

import { useTasks } from "@/app/lib/swr";
import { Task } from "@prisma/client";
import Draggable, { DropZone } from "./Draggable";
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
  const moveTask = async (task: Task, state: string, toIndex: number) => {
    if (task.state === state && task.priority === toIndex) {
      return;
    }
    task.state = state;
    task.priority = toIndex;
    const fromIndex = tasks.findIndex(({ id }) => id === task.id);
    if (fromIndex >= 0) {
      tasks?.splice(fromIndex, 1);
    }
    if (fromIndex >= 0 && toIndex > fromIndex) {
      toIndex--;
    }
    tasks?.splice(toIndex, 0, task);
    const sortedTasks =
      tasks
        ?.filter((task) => task.state === state)
        .map((task, priority) => ({
          ...task,
          priority,
        })) ?? [];
    updateTasks(sortedTasks, task.id);
  };

  const updateTasks = async (tasks: Task[], movedTaskId: string) => {
    mutate(
      [
        ...data!.filter((t) => t.state !== state && t.id !== movedTaskId), // fast deduplication
        ...tasks,
      ],
      {
        revalidate: false,
      }
    );
    await fetch(`/api/boards/${boardId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
    });
    mutate();
  };

  return (
    <section className="flex flex-col" key={state}>
      <h5 className="mb-3">{state}</h5>
      <ul className="grow flex flex-col">
        {tasks?.map((task, index) => (
          <Draggable
            key={task.id}
            item={task}
            onDrop={(d, o) => {
              const i =
                o === "bottom" ? Math.min(index + 1, tasks.length) : index;
              moveTask(d, state, i);
            }}
          >
            <TaskCard task={task} className="mb-3" />
          </Draggable>
        ))}
        <DropZone
          onDrop={(d: Task) => moveTask(d, state, tasks.length)}
          className="grow"
        />
      </ul>
    </section>
  );
}
