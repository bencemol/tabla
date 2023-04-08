import { Prisma } from "@prisma/client";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { FormEventHandler, useRef, useState } from "react";
import Button from "../button/Button";
import { useTasks } from "@/lib/swr";

export default function CreateTaskInline({
  boardId,
  stateId,
}: {
  boardId: string;
  stateId: string;
}) {
  const { mutate } = useTasks(boardId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as { title: string };
    const task: Prisma.TaskUncheckedCreateInput = {
      ...data,
      description: "",
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
      setIsFormOpen(false);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <section className="flex flex-col h-16 dark:border-zinc-800">
      {!isFormOpen ? (
        <Button
          variant="ghost"
          className="grow"
          aria-label="Create New Task"
          onClick={() => setIsFormOpen(true)}
        >
          <IconPlus className="m-auto" />
        </Button>
      ) : (
        <form
          ref={formRef}
          autoComplete="off"
          className="grow flex flex-col mb-3 space-y-3 sticky top-0 animate-in slide-in-from-bottom-1"
          onSubmit={handleSubmit}
          onReset={() => setIsFormOpen(false)}
        >
          <fieldset>
            <label htmlFor="title" className="hidden">
              What needs to be done?
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Take coffee break"
              required
              autoFocus
            />
          </fieldset>
          <footer className="flex justify-end gap-3">
            <Button type="reset">
              <IconX />
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              <IconCheck />
            </Button>
          </footer>
        </form>
      )}
    </section>
  );
}
