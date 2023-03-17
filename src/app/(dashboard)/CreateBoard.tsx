"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function CreateBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => setIsModalOpen(false);
  const onConfirm = (board: unknown) => console.log(board);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Create board</button>
      <Modal
        title="Create new board"
        isOpen={isModalOpen}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <section>
          <label htmlFor="name">Name</label>
          <input name="name" type="text" autoComplete="off" />
        </section>
        <section>
          <button value="default">Save</button>
        </section>
      </Modal>
    </>
  );
}
