"use client";

import { easeOut } from "@/lib/easing";
import { useBoards } from "@/lib/swr";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  forwardRef,
  useEffect,
  useLayoutEffect,
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
      onToggle?.(false);
      setIsLoading(false);
    };

    const scaleIn = () => {
      const form = formRef.current!;
      const children = form.querySelectorAll("*");
      form.animate(
        [{ transform: "scaleY(25%)" }, { transform: "scaleY(100%)" }],
        { duration: 150, easing: easeOut }
      );
      children.forEach((child) =>
        child.animate([{ opacity: 0 }, { opacity: 1 }], {
          delay: 100,
          duration: 150,
          easing: easeOut,
          fill: "forwards",
        })
      );
    };

    useLayoutEffect(() => {
      if (!isFormOpen) {
        return;
      }
      scaleIn();
    }, [isFormOpen]);

    useEffect(() => {
      if (!isFormOpen) {
        return;
      }
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
            onClick={() => {
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
            onReset={() => {
              setIsFormOpen(false);
              onToggle?.(false);
            }}
            className="border-2 border-t-8 space-y-8 rounded-md p-4 shadow-md origin-top [&>*]:opacity-0"
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
