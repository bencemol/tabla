import { TaskState } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";

type DeleteTaskProps = {
  taskState: TaskState;
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
      <section className="h-full grid gap-8" {...props}>
        <p>
          Are you sure you want to delete <strong>{taskState.name}</strong>?
        </p>
      </section>
      <footer>
        <Button onClick={onClose}>No</Button>
        <Button
          type="submit"
          variant="delete"
          isLoading={isLoading}
          className="-order-1"
        >
          Yes
        </Button>
      </footer>
    </Modal>
  );
}
