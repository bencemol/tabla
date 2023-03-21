"use client";

import { useTask } from "@/app/lib/swr";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditTaskProps = {
  boardId: string;
  taskId: string;
  className?: string;
};

export default function EditTask({
  boardId,
  taskId,
  className = "",
}: EditTaskProps) {
  const router = useRouter();
  const { data, mutate, error } = useTask(boardId, taskId);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    router.push(`/boards/${boardId}`);
  };

  const handleConfirm = async (data: {
    title: string;
    description?: string;
  }) => {
    const task: Prisma.TaskUpdateInput = {
      ...data,
    };
    console.log(task);
  };

  return (
    <>
      {data && (
        <Modal
          title={data.title}
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
              defaultValue={data.title}
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
              defaultValue={data.description ?? undefined}
            />
          </section>
          <footer>
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
          </footer>
        </Modal>
      )}
    </>
  );
}
