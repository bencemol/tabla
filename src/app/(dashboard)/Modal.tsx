"use client";

import { FormEvent, MouseEvent, useEffect, useRef } from "react";
import "./Modal.module.css";

type ModalProps = {
  title: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: <T>(data: T) => void;
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

  const confirm = (event: FormEvent) => {
    event.preventDefault();
    const form = formRef.current!;
    const data = Object.fromEntries(new FormData(form));
    onConfirm(data);
  };

  const dismiss = ({ target }: MouseEvent<HTMLDialogElement>) => {
    if (target instanceof HTMLDialogElement && target.nodeName === "DIALOG") {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={dismiss}
      onCancel={onClose}
      className="dialog fixed m-auto rounded-md p-4 shadow-md  backdrop:backdrop-blur-sm"
    >
      <form
        ref={formRef}
        onSubmit={confirm}
        autoComplete="off"
        className="grid gap-5"
      >
        <h2>{title}</h2>
        {children}
      </form>
    </dialog>
  );
}
