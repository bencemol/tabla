"use client";

import { Prisma, Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Modal from "../../Modal";

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
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <button className={className} onClick={() => setIsModalOpen(true)}>
        Create task
      </button>
      <Modal
        title="Create new task"
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <section>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required />
        </section>
        <section>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            cols={30}
            className="resize-none"
          />
        </section>
        <section>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </section>
      </Modal>
    </>
  );
}
