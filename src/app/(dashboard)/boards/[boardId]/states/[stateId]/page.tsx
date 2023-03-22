import EditState from "@/components/board/EditState";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

function getTaskState(id: string) {
  return db.taskState.findUnique({ where: { id }, include: { tasks: true } });
}

function getBoardStateCount(boardId: string) {
  return db.taskState.count({ where: { boardId } });
}

type StatesProps = {
  params: {
    boardId: string;
    stateId: string;
  };
};

export default async function States({
  params: { stateId, boardId },
}: StatesProps) {
  const [taskState, stateCount] = await Promise.all([
    getTaskState(stateId),
    getBoardStateCount(boardId),
  ]);
  if (!taskState) {
    notFound();
  }

  const stateHasTasks = taskState.tasks.length < 1;

  const canDelete = stateHasTasks && stateCount > 1;
  return <EditState taskState={taskState} canDelete={canDelete} />;
}
