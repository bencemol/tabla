"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { useTasks } from "@/lib/swr";
import { Task } from "@/models/task";
import { Prisma } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FocusEvent, FocusEventHandler, useState } from "react";
import TextArea from "../textarea/TextArea";
import DeleteTask from "./DeleteTask";

type EditTaskProps = {
  boardId: string;
  task: Task;
};

export default function EditTask({ boardId, task }: EditTaskProps) {
  const router = useRouter();
  const { mutate } = useTasks(boardId);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    router.push(`/boards/${boardId}`);
  };

  const handleConfirm = async (data: {
    title?: string;
    description?: string;
  }) => {
    if (!isDirty) {
      return;
    }
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
      setIsDirty(false);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleBlur =
    <T extends HTMLInputElement | HTMLTextAreaElement>(
      onBlur: FocusEventHandler<T>
    ) =>
    (e: FocusEvent<T>) => {
      if (!e.target.checkValidity()) {
        return;
      }
      onBlur(e);
    };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <div tabIndex={-1} className="fixed"></div>
        <fieldset className="-ml-2 -mb-2">
          <TextArea
            id="title"
            name="title"
            className="resize-none overflow-hidden text-xl border-transparent hover:border-inherit focus:border-inherit invalid:border-inherit"
            placeholder="e.g. Take coffee break"
            required
            defaultValue={task.title}
            onChange={() => setIsDirty(true)}
            onBlur={handleBlur((e) => handleConfirm({ title: e.target.value }))}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="description">Description</label>
          <TextArea
            id="description"
            name="description"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the a batteries a little."
            className="resize-none min-h-[20rem] max-h-96"
            defaultValue={task.description ?? undefined}
            onChange={() => setIsDirty(true)}
            onBlur={handleBlur((e) =>
              handleConfirm({ description: e.target.value })
            )}
          />
        </fieldset>
        <footer className="grid-cols-[repeat(3,1fr)]">
          <Button
            className="col-start-3"
            onClick={handleClose}
            isLoading={isLoading}
            autoFocus
          >
            Close
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
