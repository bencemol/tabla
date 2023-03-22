import { Task } from "@prisma/client";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import { useState } from "react";
import { useTasks } from "@/lib/swr";

type DeleteTaskProps = {
  task: Task;
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLElement>;

export default function DeleteTask({
  task,
  isOpen,
  onConfirm,
  onClose,
  ...props
}: DeleteTaskProps) {
  const { mutate } = useTasks(task.boardId);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/boards/${task.boardId}/tasks/${task.id}`, {
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
      title={`Delete task ${task.title}`}
      isOpen={isOpen}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      <section {...props}>
        <p>
          Are you sure you want to delete the <strong>{task.title}</strong>{" "}
          task?
        </p>
      </section>
      <footer>
        <Button onClick={onClose}>No</Button>
        <Button
          type="submit"
          variant="danger"
          isLoading={isLoading}
          className="-order-1"
        >
          Yes
        </Button>
      </footer>
    </Modal>
  );
}
