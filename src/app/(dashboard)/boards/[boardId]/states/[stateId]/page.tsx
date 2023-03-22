import EditState from "@/components/board/EditState";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

function getTaskState(id: string) {
  return db.taskState.findUnique({ where: { id }, include: { tasks: true } });
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
  const [taskState] = await Promise.all([getTaskState(stateId)]);
  if (!taskState) {
    notFound();
  }

  return <EditState taskState={taskState} />;
}
