import EditState from "@/components/board/EditState";
import { db } from "@/lib/db";
import { TaskStateWithTasks } from "@/models/task-state";
import { notFound } from "next/navigation";

async function getTaskState(id: string) {
  const data = await db.taskState.findUnique({
    where: { id },
    include: { tasks: true },
  });
  return TaskStateWithTasks.parse(data);
}

type StatesProps = {
  params: {
    boardId: string;
    stateId: string;
  };
};

export default async function States({ params: { stateId } }: StatesProps) {
  const taskState = await getTaskState(stateId);
  if (!taskState) {
    notFound();
  }

  return <EditState taskState={taskState} />;
}
