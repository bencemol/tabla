import { db } from "@/lib/db";
import EditTask from "@/components/board/EditTask";
import { notFound } from "next/navigation";

async function getTask(id: string) {
  return db.task.findUnique({ where: { id } });
}

type TaskProps = {
  params: {
    boardId: string;
    taskId: string;
  };
};

export default async function Task({ params: { boardId, taskId } }: TaskProps) {
  const task = await getTask(taskId);
  if (!task) {
    notFound();
  }

  return <EditTask boardId={boardId} task={task} />;
}
