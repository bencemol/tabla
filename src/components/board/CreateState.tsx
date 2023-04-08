import { useTaskStates } from "@/lib/swr";
import { Prisma } from "@prisma/client";
import {
  IconCheck,
  IconDotsVertical,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import Button from "../button/Button";

export default function CreateState({ boardId }: { boardId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useTaskStates(boardId);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as { name: string };
    const state: Prisma.TaskStateUncheckedCreateInput = {
      ...data,
      boardId,
    };
    try {
      await fetch(`/api/boards/${boardId}/states`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).then((res) => res.json());
      await mutate();
      setIsFormOpen(false);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      formRef.current?.setAttribute("inert", "");
    } else {
      formRef.current?.removeAttribute("inert");
    }
  }, [isLoading]);

  return (
    <Column>
      <header className="h-14 grid grid-flow-col items-center -m-1 p-1 pb-3 z-10 bg-white dark:bg-zinc-900">
        <h5 className="uppercase transition-colors">Create Column</h5>
        <Button disabled className="invisible">
          <IconDotsVertical size={16} />
        </Button>
      </header>
      <section className="sticky top-14 bottom-0 h-[calc(100vh-152px)] py-2 flex">
        {isFormOpen ? (
          <form
            ref={formRef}
            autoComplete="off"
            className="grow flex flex-col mb-3 space-y-3 sticky top-0 animate-in slide-in-from-bottom-1"
            onSubmit={handleSubmit}
            onReset={() => setIsFormOpen(false)}
          >
            <fieldset>
              <label htmlFor="name" className="hidden">
                Column Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Column Name"
                aria-label="New Column Name"
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
        ) : (
          <Button
            variant="ghost"
            className="mb-3 w-full"
            aria-label="Create Column"
            onClick={() => setIsFormOpen(true)}
          >
            <IconPlus className="m-auto" />
          </Button>
        )}
      </section>
    </Column>
  );
}

const Column = ({ children }: { children: React.ReactNode }) => (
  <section className="flex flex-col text-zinc-200 hover:text-inherit focus-within:text-inherit [&:has(form)]:text-inherit dark:text-zinc-800 dark:border-zinc-800">
    {children}
  </section>
);
