import { IconPlus } from "@tabler/icons-react";
import Button from "../button/Button";
import { CreateTaskModal } from "./CreateTask";
import { useState } from "react";

export default function CreateTaskInline({
  boardId,
  stateId,
}: {
  boardId: string;
  stateId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="flex flex-col h-16 dark:border-neutral-800">
      <Button
        variant="flat"
        className="grow border-2 border-dashed border-inherit hover:border-transparent text-neutral-200 hover:text-inherit focus-visible:focus-within:text-inherit dark:text-neutral-800 hover:!bg-neutral-100 dark:hover:!bg-neutral-800"
        aria-label="Create New Task"
        onClick={() => setIsModalOpen(true)}
      >
        <IconPlus className="m-auto" />
      </Button>
      <CreateTaskModal
        boardId={boardId}
        isOpen={isModalOpen}
        stateId={stateId}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
