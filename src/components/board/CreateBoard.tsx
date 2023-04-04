"use client";

import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { Board } from "@/models/board";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function CreateBoard({ className = "", onClose = () => {} }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isLoading = isFetching || isPending;

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };
  const handleConfirm = async (data: unknown) => {
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
    startTransition(() => {
      router.push(`/boards/${board.id}`);
      router.refresh();
      onClose();
    });
    setIsFetching(false);
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        variant="primary"
        className={className}
      >
        <IconPlus />
        Create Board
      </Button>
      <Modal
        title="Create New Board"
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <fieldset>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Roadmap"
            required
          />
        </fieldset>
        <footer>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create
          </Button>
        </footer>
      </Modal>
    </>
  );
}
