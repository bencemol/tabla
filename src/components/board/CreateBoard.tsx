"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { Board } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
      board = await fetch(`/api/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
    } catch (e) {
      console.error(e);
    }
    setIsFetching(false);
    startTransition(() => {
      router.push(`/boards/${board.id}`);
      router.refresh();
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        className="w-full"
      >
        <IconPlus className="w-6 stroke-2" />
        Create Board
      </Button>
      <Modal
        title="Create New Board"
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <section>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Roadmap"
            required
          />
        </section>
        <footer>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save
          </Button>
          <Button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </footer>
      </Modal>
    </>
  );
}
