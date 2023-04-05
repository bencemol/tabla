import { useTaskStates } from "@/lib/swr";
import { TaskStateWithTasks } from "@/models/task-state";
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
  const [isLoading, setIsLoading] = useState(false);
  const hasTasks = (taskState.tasks?.length ?? 0) > 0;
  const { mutate } = useTaskStates(taskState.boardId);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/boards/${taskState.boardId}/states/${taskState.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      await mutate();
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
      className="slide-in-from-bottom-3"
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
        <Button onClick={onClose} autoFocus>
          No
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Yes
        </Button>
      </footer>
    </Modal>
  );
}
