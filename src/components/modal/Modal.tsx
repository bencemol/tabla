"use client";

import {
  FormEvent,
  MouseEvent,
  MouseEventHandler,
  ReactEventHandler,
  useEffect,
  useRef,
} from "react";

type ModalProps = {
  title?: string;
  isOpen: boolean;
  isLoading?: boolean;
  className?: string;
  onConfirm?: (data: any) => Promise<void>;
  onClose?: () => void;
  children: React.ReactNode;
};

export default function Modal({
  title,
  isOpen,
  isLoading,
  className,
  onConfirm,
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    dialogRef.current?.removeAttribute("open");
  }, []);

  useEffect(() => {
    if (isOpen) {
      formRef.current?.reset();
      dialogRef.current?.showModal();
      document.documentElement.style.overflow = "hidden";
    } else {
      dialogRef.current?.close();
      document.documentElement.style.removeProperty("overflow");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLoading) {
      dialogRef.current?.setAttribute("inert", "");
    } else {
      dialogRef.current?.removeAttribute("inert");
    }
  }, [isLoading]);

  const confirm = async (event: FormEvent) => {
    event.preventDefault();
    const form = formRef.current!;
    const data = Object.fromEntries(new FormData(form));
    await onConfirm?.(data);
    onClose?.();
  };

  const dismiss = (event: MouseEvent<HTMLDialogElement>) => {
    const { target } = event;
    if (
      !isLoading &&
      target instanceof HTMLDialogElement &&
      target.nodeName === "DIALOG"
    ) {
      onClose?.();
    }
    event.stopPropagation();
  };

  const handleCancel: ReactEventHandler<HTMLDialogElement> = (e) => {
    if (isLoading) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    onClose?.();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={dismiss}
      onCancel={handleCancel}
      className={`fixed w-full max-w-[60ch] mx-auto mt-0 sm:!mt-40 p-6 bg-transparent backdrop:backdrop-blur-sm backdrop:overflow-hidden animate-in ${className}`}
    >
      <main className="rounded-md border-2 border-t-8 shadow-lg bg-white dark:bg-zinc-900">
        <form
          ref={formRef}
          onSubmit={confirm}
          autoComplete="off"
          className="relative grid gap-8 p-4 [&>footer]:grid [&>footer]:grid-flow-col [&>footer]:auto-cols-fr [&>footer]:justify-end [&>footer]:flex-wrap [&>footer]:gap-3 [&>footer>button]:justify-center"
          style={{ wordBreak: "break-word" }}
        >
          {title && (
            <header className="min-w-0 -m-4 p-4 pb-4 bg-white dark:bg-zinc-900">
              <h2 className="text-ellipsis overflow-hidden">{title}</h2>
            </header>
          )}
          {children}
        </form>
      </main>
    </dialog>
  );
}
