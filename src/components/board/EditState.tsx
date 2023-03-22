"use client";

import { Prisma, TaskState } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import { DeleteState } from "./DeleteState";

export default function EditState({
  taskState,
  canDelete,
}: {
  taskState: TaskState;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = () => {
    setIsModalOpen(false);
    router.push(`/boards/${taskState.boardId}`);
    router.refresh();
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    router.push(`/boards/${taskState.boardId}`);
    router.refresh();
  };

  const handleConfirm = async (data: { name: string }) => {
    setIsLoading(true);
    const payload: Prisma.TaskStateUpdateInput = {
      ...data,
    };
    try {
      await fetch(`/api/boards/${taskState.boardId}/states/${taskState.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        title={`Edit ${taskState.name}`}
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
            placeholder="e.g. Ready to Deploy"
            required
            defaultValue={taskState.name}
          />
        </section>
        <footer>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save
          </Button>
          <Button onClick={handleUpdate}>Cancel</Button>
          <Button
            variant="delete"
            className="-order-1 mr-auto"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={!canDelete}
          >
            Delete
          </Button>
        </footer>
      </Modal>
      <DeleteState
        taskState={taskState}
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
