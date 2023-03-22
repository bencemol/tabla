import { Prisma } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import Button from "../button/Button";
import { useRouter } from "next/navigation";

export default function CreateState({ boardId }: { boardId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      router.refresh();
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
      <h5 className="pb-3 uppercase sticky top-0 z-10 bg-white dark:bg-stone-900 transition-colors">
        Create Column
      </h5>
      {isFormOpen ? (
        <form
          ref={formRef}
          autoComplete="off"
          className="grow flex flex-col mb-3 sticky top-0"
          onSubmit={handleSubmit}
          onReset={() => setIsFormOpen(false)}
        >
          <section className="pb-3">
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
          </section>
          <footer className="flex justify-end gap-3">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save
            </Button>
            <Button type="reset">Cancel</Button>
          </footer>
        </form>
      ) : (
        <Button
          variant="flat"
          className="grow mb-3 border-2 border-dashed border-inherit hover:border-transparent"
          aria-label="Create Column"
          onClick={() => setIsFormOpen(true)}
        >
          <IconPlus className="m-auto" />
        </Button>
      )}
    </Column>
  );
}

const Column = ({ children }: { children: React.ReactNode }) => (
  <section className="flex flex-col text-neutral-200 hover:text-inherit focus-within:text-inherit [&:has(form)]:text-inherit dark:text-neutral-800 dark:border-neutral-800">
    {children}
  </section>
);
