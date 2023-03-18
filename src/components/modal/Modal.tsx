"use client";

import { FormEvent, MouseEvent, useEffect, useRef } from "react";

type ModalProps = {
  title: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: (data: any) => Promise<void>;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  title,
  isOpen,
  isLoading,
  onConfirm,
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      formRef.current?.reset();
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
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
    await onConfirm(data);
    onClose();
  };

  const dismiss = (event: MouseEvent<HTMLDialogElement>) => {
    const { target } = event;
    if (target instanceof HTMLDialogElement && target.nodeName === "DIALOG") {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={dismiss}
      onCancel={onClose}
      className="fixed m-auto rounded-md p-4 shadow-lg backdrop:backdrop-blur-sm"
    >
      <form
        ref={formRef}
        onSubmit={confirm}
        autoComplete="off"
        className="grid gap-8 [&>footer]:flex [&>footer]:justify-end [&>footer]:gap-3"
      >
        <header className="-m-4 p-4 pb-4 border-t-8 border-black dark:border-white">
          <h2>{title}</h2>
        </header>
        {children}
      </form>
    </dialog>
  );
}
