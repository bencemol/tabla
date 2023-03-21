"use client";

import { useTasks } from "@/app/lib/swr";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { Prisma } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

type CreateTaskProps = {
  boardId: string;
  className?: string;
};

export default function CreateTask({
  boardId,
  className = "",
}: CreateTaskProps) {
  const { mutate } = useTasks(boardId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setIsModalOpen(false);
  const handleConfirm = async (data: {
    title: string;
    description?: string;
  }) => {
    setIsLoading(true);
    const task: Prisma.TaskUncheckedCreateInput = {
      ...data,
      boardId,
      state: "TODO",
    };
    try {
      await fetch(`/api/boards/${boardId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).then((res) => res.json());
      await mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button
        className={`aspect-square sm:aspect-auto grow-0 ${className}`}
        onClick={() => setIsModalOpen(true)}
        variant="primary"
      >
        <IconPlus />
        <span className="hidden sm:inline">Add Task</span>
      </Button>
      <Modal
        title="Add New Task"
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
          />
        </section>
        <section>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the a batteries a little."
            rows={5}
            cols={30}
            className="resize-none"
          />
        </section>
        <footer>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save
          </Button>
          <Button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </footer>
      </Modal>
    </>
  );
}
