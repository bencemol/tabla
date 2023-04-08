"use client";

import { useBoards } from "@/lib/swr";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../button/Button";

type CreateBoardInlineProps = {
  className?: string;
  onToggle?: (isOpen: boolean) => void;
};

const CreateBoardInline = forwardRef<HTMLElement, CreateBoardInlineProps>(
  function CreateBoardInline({ onToggle, className }, ref) {
    const router = useRouter();
    const { mutate } = useBoards();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const form = e.target as HTMLFormElement;
      const data = Object.fromEntries(new FormData(form)) as { name: string };
      try {
        await fetch(`/api/boards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((res) => res.json());
      } catch (e) {
        console.error(e);
      }
      await mutate();
      router.refresh();
      setIsFormOpen(false);
      setIsLoading(false);
    };

    useEffect(() => {
      onToggle?.(isFormOpen);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFormOpen]);

    useEffect(() => {
      if (isLoading) {
        formRef.current?.setAttribute("inert", "");
      } else {
        formRef.current?.removeAttribute("inert");
      }
    }, [isLoading]);

    return (
      <section ref={ref}>
        {!isFormOpen ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsFormOpen(true);
            }}
            variant="primary"
            className={className}
          >
            <IconPlus />
            Create Board
          </Button>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            onReset={() => setIsFormOpen(false)}
            className="border-2 border-t-8 space-y-8 rounded-md p-4 shadow-md animate-in zoom-in-95"
            autoComplete="off"
          >
            <fieldset>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Roadmap"
                required
                autoFocus
              />
            </fieldset>
            <footer className="grid gap-3 grid-flow-col auto-cols-fr flex-wrap">
              <Button type="reset" className="justify-center">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="justify-center"
              >
                Create
              </Button>
            </footer>
          </form>
        )}
      </section>
    );
  }
);

export default CreateBoardInline;
