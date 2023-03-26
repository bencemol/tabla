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
    <section className="flex flex-col h-16 dark:border-zinc-800">
      <Button
        variant="ghost"
        className="grow"
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
