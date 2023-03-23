"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { BoardUpdateInput, BoardWithTasks } from "@/models/Board";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteBoard from "./DeleteBoard";

type EditBoardProps = {
  board: BoardWithTasks;
};

export default function EditBoard({ board }: EditBoardProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = () => {
    setIsModalOpen(false);
    router.push(`/boards/${board.id}`);
    router.refresh();
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleConfirm = async (data: BoardUpdateInput) => {
    setIsLoading(true);
    try {
      await fetch(`/api/boards/${board.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        title={`Edit ${board.name}`}
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={handleUpdate}
        onConfirm={handleConfirm}
      >
        <section>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Roadmap"
            required
            defaultValue={board.name}
          />
        </section>
        <footer>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save
          </Button>
          <Button onClick={handleUpdate}>Cancel</Button>
          <Button
            variant="danger"
            className="-order-1 mr-auto"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <IconTrash />
          </Button>
        </footer>
      </Modal>
      <DeleteBoard
        board={board}
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
