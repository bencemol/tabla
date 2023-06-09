"use client";

import { useTaskStates } from "@/lib/swr";
import { TaskStateUpdateInput, TaskStateWithTasks } from "@/models/task-state";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import { DeleteState } from "./DeleteState";

export default function EditState({
  taskState,
}: {
  taskState: TaskStateWithTasks;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useTaskStates(taskState.boardId);

  const handleUpdate = () => {
    setIsModalOpen(false);
    router.push(`/boards/${taskState.boardId}`);
    mutate();
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    router.push(`/boards/${taskState.boardId}`);
    mutate();
  };

  const handleConfirm = async (data: TaskStateUpdateInput) => {
    setIsLoading(true);
    try {
      await fetch(`/api/boards/${taskState.boardId}/states/${taskState.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await mutate();
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
        <fieldset>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Ready to Deploy"
            required
            defaultValue={taskState.name}
          />
        </fieldset>
        <footer>
          <Button onClick={handleUpdate}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save
          </Button>
          <Button
            variant="danger"
            className={`-order-1 mr-auto`}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <IconTrash />
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
