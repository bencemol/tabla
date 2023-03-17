"use client";

import { FormEvent, useEffect, useRef } from "react";
import "./Modal.module.css";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onConfirm: <T>(data: T) => void;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  title,
  isOpen,
  onConfirm,
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const confirmAndClose = () => {
    if (!formRef.current) {
      console.error("formRef was undefined");
      return;
    }
    console.log(new FormData(formRef.current));
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className="dialog fixed left-[50%] top-[50%] p-4 shadow-md backdrop:bg-slate-700/50"
    >
      <form method="dialog" ref={formRef} onSubmit={confirmAndClose}>
        <h3>{title}</h3>
        {children}
      </form>
    </dialog>
  );
}
