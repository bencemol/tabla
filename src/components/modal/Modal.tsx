import {
  FormEvent,
  MouseEvent,
  ReactEventHandler,
  useEffect,
  useRef,
} from "react";

type ModalProps = {
  title: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm?: (data: any) => Promise<void>;
  onClose?: () => void;
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
      className="fixed w-full max-w-[50ch] m-auto my-0 sm:my-auto p-6 bg-transparent backdrop:backdrop-blur-sm backdrop:overflow-hidden will-change-transform animate-in slide-in-from-bottom-3"
    >
      <main className="rounded-md border-2 border-black dark:border-neutral-700 shadow-lg bg-white dark:bg-stone-900">
        <form
          ref={formRef}
          onSubmit={confirm}
          autoComplete="off"
          className="grid gap-8 p-4 [&>footer]:flex [&>footer]:justify-end [&>footer]:flex-wrap [&>footer]:gap-3"
        >
          <header className="-m-4 p-4 pb-4 border-t-8 bg-white dark:bg-stone-900 border-black dark:border-neutral-700">
            <h2>{title}</h2>
          </header>
          {children}
        </form>
      </main>
    </dialog>
  );
}
