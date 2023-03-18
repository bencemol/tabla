"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { Prisma, Task } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type CreateTaskProps = {
  boardId: string;
  className?: string;
};

export default function CreateTask({ boardId, className }: CreateTaskProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isLoading = isFetching || isPending;

  const onClose = () => setIsModalOpen(false);
  const onConfirm = async (formData: {
    title: string;
    description?: string;
  }) => {
    const data: Prisma.TaskUncheckedCreateInput = {
      ...formData,
      boardId,
      state: "TODO",
    };
    let task: Task;
    setIsFetching(true);
    try {
      task = await fetch(`/api/board/${boardId}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
    } catch (e) {
      console.error(e);
    }
    setIsFetching(false);
    startTransition(() => router.refresh());
  };

  return (
    <>
      <Button
        className={className}
        onClick={() => setIsModalOpen(true)}
        variant="primary"
      >
        <IconPlus size="1.25rem" stroke={1.625} />
        Add Task
      </Button>
      <Modal
        title="Add New Task"
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={onConfirm}
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
          <Button type="submit" variant="primary">
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
