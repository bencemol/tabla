"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { useTasks } from "@/lib/swr";
import { Prisma } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

type CreateTaskProps = {
  boardId: string;
  className?: string;
};

export function CreateTask({ boardId, className = "" }: CreateTaskProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className={`aspect-square sm:aspect-auto grow-0 ${className}`}
        onClick={() => setIsModalOpen(true)}
        variant="primary"
      >
        <IconPlus />
        <span className="hidden sm:inline">Create Task</span>
      </Button>
      <CreateTaskModal
        boardId={boardId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

type CreateTaskModalProps = {
  boardId: string;
  isOpen: boolean;
  stateId?: string;
  onClose?: () => void;
};

export function CreateTaskModal({
  boardId,
  isOpen,
  stateId,
  onClose,
}: CreateTaskModalProps) {
  const { mutate } = useTasks(boardId);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (data: {
    title: string;
    description?: string;
  }) => {
    setIsLoading(true);
    const task: Omit<Prisma.TaskUncheckedCreateInput, "stateId"> &
      Partial<Pick<Prisma.TaskUncheckedCreateInput, "stateId">> = {
      ...data,
      boardId,
      stateId,
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
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        title="Create New Task"
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={onClose}
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
          <Button onClick={onClose}>Cancel</Button>
        </footer>
      </Modal>
    </>
  );
}
