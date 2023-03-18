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
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        className="w-full"
      >
        <IconPlus size="1.25rem" stroke={1.625} />
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
          <Button type="submit" variant="primary">
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
