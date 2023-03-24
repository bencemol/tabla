import { BoardWithTasks } from "@/models/Board";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";

type DeleteBoardProps = {
  board: BoardWithTasks;
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLElement>;

export default function DeleteBoard({
  board,
  isOpen,
  onConfirm,
  onClose,
  ...props
}: DeleteBoardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const hasTasks = (board.tasks?.length ?? 0) > 0;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/boards/${board.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      onConfirm?.();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title={`Delete ${board.name}`}
      isOpen={isOpen}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      <section {...props}>
        <p>
          Are you sure you want to delete the <strong>{board.name}</strong>{" "}
          board?
        </p>
        {hasTasks && (
          <p>
            <strong>{board.tasks!.length}</strong> task
            {board.tasks!.length > 1 ? "s" : ""} will be deleted with it.
          </p>
        )}
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
