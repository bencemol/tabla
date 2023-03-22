import { Board } from "@prisma/client";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";

type DeleteBoardProps = {
  board: Board;
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
      <section className="h-full grid gap-8" {...props}>
        <p>
          Are you sure you want to delete <strong>{board.name}</strong>?
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
