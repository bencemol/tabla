"use client";

import { Board } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Modal from "@/components/modal/Modal";

export default function CreateBoard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isLoading = isFetching || isPending;

  const onClose = () => setIsModalOpen(false);
  const onConfirm = async (data: unknown) => {
    setIsFetching(true);
    let board: Board;
    try {
      board = await fetch(`/api/board`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
    } catch (e) {
      console.error(e);
    }
    setIsFetching(false);
    startTransition(() => {
      router.push(`/board/${board.id}`);
      router.refresh();
    });
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>+ Board</button>
      <Modal
        title="Create New Board"
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <section>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required />
        </section>
        <section>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </section>
      </Modal>
    </>
  );
}
