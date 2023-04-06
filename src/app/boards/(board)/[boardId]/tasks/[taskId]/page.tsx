import EditTask from "@/components/board/EditTask";
import { db } from "@/lib/db";
import { Task } from "@/models/task";
import { notFound } from "next/navigation";

async function getTask(id: string) {
  const data = await db.task.findUnique({ where: { id } });
  return Task.parse(data);
}

type TaskProps = {
  params: {
    boardId: string;
    taskId: string;
  };
};

export default async function TaskPage({
  params: { boardId, taskId },
}: TaskProps) {
  const task = await getTask(taskId);
  if (!task) {
    notFound();
  }

  return <EditTask boardId={boardId} task={task} />;
}
