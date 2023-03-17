"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function CreateBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => setIsModalOpen(false);
  const onConfirm = async (board: unknown) => {
    setIsLoading(true);
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Create board</button>
      <Modal
        title="Create new board"
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
            required
            autoComplete="off"
          />
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
