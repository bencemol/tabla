import { TaskStateWithTasks } from "@/models/TaskState";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";

type DeleteTaskProps = {
  taskState: TaskStateWithTasks;
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLElement>;

export function DeleteState({
  taskState,
  isOpen,
  onConfirm,
  onClose,
  ...props
}: DeleteTaskProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const hasTasks = (taskState.tasks?.length ?? 0) > 0;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/boards/${taskState.boardId}/states/${taskState.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      router.refresh();
      onConfirm?.();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title={`Delete ${taskState.name}`}
      isOpen={isOpen}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      <section {...props}>
        <p>
          Are you sure you want to delete the <strong>{taskState.name}</strong>{" "}
          column?
        </p>
        {hasTasks && (
          <p>
            <strong>{taskState.tasks!.length}</strong> task
            {taskState.tasks!.length > 1 ? "s" : ""} in this column will be
            deleted with it.
          </p>
        )}
      </section>
      <footer>
        <Button onClick={onClose}>No</Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="-order-1"
        >
          Yes
        </Button>
      </footer>
    </Modal>
  );
}
