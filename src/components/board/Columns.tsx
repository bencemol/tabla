"use client";

import { DragContext } from "@/lib/drag-n-drop";
import { useTaskStates } from "@/lib/swr";
import { Task } from "@/models/task";
import { TaskState } from "@/models/task-state";
import { useDeferredValue, useState } from "react";
import { SWRConfig } from "swr";
import Column from "./Column";
import CreateState from "./CreateState";
import Draggable, { DropZone } from "./Draggable";

type ColumnsProps = {
  boardId: string;
  tasks: Task[];
  states: TaskState[];
  className: string;
};

export default function Columns({
  boardId,
  tasks,
  states,
  className,
}: ColumnsProps) {
  const dragState = useState<string>();

  const tasksFallback = tasks.reduce(
    (fallback, task) => ({
      ...fallback,
      [`/api/boards/${task.boardId}/tasks/${task.id}`]: task,
    }),
    {}
  );
  const fallback = {
    [`/api/boards/${boardId}/tasks`]: tasks,
    ...tasksFallback,
  };
  const deferredFallback = useDeferredValue(fallback);

  const { data: taskStates, mutate } = useTaskStates(boardId, states);

  const moveTaskState = async (taskState: TaskState, toIndex: number) => {
    const fromIndex = taskStates!.findIndex(({ id }) => id === taskState.id);
    if (fromIndex >= 0) {
      taskStates?.splice(fromIndex, 1);
    }
    if (fromIndex >= 0 && toIndex > fromIndex) {
      toIndex--;
    }
    if (taskState.order === toIndex) {
      return;
    }
    taskState.order = toIndex;
    taskStates?.splice(toIndex, 0, taskState);
    const sortedStates =
      taskStates?.map((state, order) => ({ ...state, order })) ?? [];
    updateTaskStates(sortedStates);
  };

  const updateTaskStates = async (taskStates: TaskState[]) => {
    mutate(taskStates, { revalidate: false });
    await fetch(`/api/boards/${boardId}/states`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskStates),
    });
    mutate();
  };

  return (
    <SWRConfig value={{ fallback: deferredFallback }}>
      <ul
        id="scrollBox"
        className={`grid grid-flow-col auto-cols-[minmax(20ch,_30ch)] overflow-auto stop-panning ${className}`}
      >
        <DragContext.Provider value={dragState}>
          {taskStates?.map((state, index) => (
            <Draggable
              key={state.id}
              item={state}
              direction="horizontal"
              dragContext="state"
              onDrop={(d, o) => {
                const i =
                  o === "right"
                    ? Math.min(index + 1, taskStates.length)
                    : index;
                moveTaskState(d, i);
              }}
            >
              <Column state={state} className="mr-6" />
            </Draggable>
          ))}
          <DropZone
            dragContext="state"
            onDrop={(d: TaskState) => moveTaskState(d, tasks.length)}
            className="transition-transform"
          >
            <CreateState boardId={boardId} />
          </DropZone>
        </DragContext.Provider>
      </ul>
    </SWRConfig>
  );
}
