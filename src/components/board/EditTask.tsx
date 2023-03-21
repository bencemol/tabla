"use client";

import { useTask, useTasks } from "@/app/lib/swr";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditTaskProps = {
  boardId: string;
  taskId: string;
};

export default function EditTask({ boardId, taskId }: EditTaskProps) {
  const router = useRouter();
  const { mutate } = useTasks(boardId);
  const { data } = useTask(boardId, taskId);

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    router.push(`/boards/${boardId}`);
    router.refresh();
  };

  const handleConfirm = async (data: {
    title: string;
    description?: string;
  }) => {
    setIsLoading(true);
    const task: Prisma.TaskUpdateInput = {
      ...data,
    };
    try {
      await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: "PATCH",
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
      {data && (
        <Modal
          title={`Edit ${data.title}`}
          isOpen={true}
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
            <Button type="submit" variant="primary" isLoading={isLoading}>
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
