import EditTask from "@/components/board/EditTask";

type TaskProps = {
  params: {
    boardId: string;
    taskId: string;
  };
};

export default function Task({ params: { boardId, taskId } }: TaskProps) {
  return <EditTask boardId={boardId} taskId={taskId} />;
}
