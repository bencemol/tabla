"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { useTasks } from "@/lib/swr";
import { Task } from "@/models/task";
import { Prisma } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteTask from "./DeleteTask";
import TextArea from "../textarea/TextArea";

type EditTaskProps = {
  boardId: string;
  task: Task;
};

export default function EditTask({ boardId, task }: EditTaskProps) {
  const router = useRouter();
  const { mutate } = useTasks(boardId);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    router.push(`/boards/${boardId}`);
  };

  const handleConfirm = async (data: {
    title: string;
    description?: string;
  }) => {
    setIsLoading(true);
    const payload: Prisma.TaskUpdateInput = {
      ...data,
    };
    try {
      await fetch(`/api/boards/${boardId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        title={`Edit ${task.title}`}
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <section>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Take coffee break"
            required
            defaultValue={task.title}
          />
        </section>
        <section>
          <label htmlFor="description">Description</label>
          <TextArea
            id="description"
            name="description"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the a batteries a little."
            className="resize-none min-h-[10rem] max-h-96"
            defaultValue={task.description ?? undefined}
          />
        </section>
        <footer>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save
          </Button>
          <Button
            variant="danger"
            className="-order-1 mr-auto"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <IconTrash />
          </Button>
        </footer>
      </Modal>
      <DeleteTask
        task={task}
        isOpen={isDeleteModalOpen}
        onConfirm={handleClose}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
