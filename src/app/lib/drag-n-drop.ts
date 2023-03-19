import { DragEventHandler, useState } from "react";

export function useDrag<T>() {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart: (payload: T) => DragEventHandler =
    (payload) => (e) => {
      setIsDragging(true);
      const data = JSON.stringify(payload);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", data);
      setOffset(e.target as HTMLElement);
    };
  const handleDragEnd: DragEventHandler = (e) => {
    setIsDragging(false);
    e.dataTransfer.clearData();
  };

  return { isDragging, handleDragStart, handleDragEnd } as const;
}

export function useDrop<T>() {
  const [overlapping, setOverlapping] = useState<"top" | "bottom">();
  const [_, setDragEnterLeave] = useState(0);
  const [dragTargetRect, setDragTargetRect] = useState<DOMRect>();
  const handleDragOver: DragEventHandler = (e) => {
    if (e.dataTransfer.types[0] !== "text/plain") {
      return;
    }
    if (dragTargetRect) {
      const y = e.clientY - dragTargetRect.top;
      setOverlapping(y <= dragTargetRect.height / 2 ? "top" : "bottom");
    }
    e.preventDefault();
  };
  const handleDrop: (
    callback: (data: T, over: typeof overlapping) => void
  ) => DragEventHandler = (callback) => (e) => {
    let data: T;
    try {
      data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data) {
        callback(data, overlapping);
      }
    } catch {}
    removeOffset();
    setOverlapping(undefined);
    setDragEnterLeave(0);
    e.preventDefault();
  };

  const handleDragEnter: DragEventHandler = (e) => {
    setDragEnterLeave((val) => ++val);
    const rect = (
      e.currentTarget as HTMLElement
    ).firstElementChild?.getBoundingClientRect();
    setDragTargetRect(rect);
  };

  const handleDragLeave: DragEventHandler = () =>
    setDragEnterLeave((dragEnterLeave) => {
      dragEnterLeave--;
      if (dragEnterLeave === 0) {
        setOverlapping(undefined);
      }
      return dragEnterLeave;
    });

  return {
    overlapping,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } as const;
}

const setOffset = (dragTarget?: HTMLElement) => {
  if (!dragTarget) {
    return;
  }
  const rect = dragTarget.firstElementChild!.getBoundingClientRect();
  document.documentElement.style.setProperty(
    "--drag-over-offset",
    `${rect.height}px`
  );
};

const removeOffset = () =>
  document.documentElement.style.removeProperty("--drag-over-offset");
