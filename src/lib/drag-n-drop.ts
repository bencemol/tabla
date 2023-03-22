import { DragEventHandler, useRef, useState } from "react";

export function useDrag<T>() {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart: (payload: T) => DragEventHandler =
    (payload) => (e) => {
      setIsDragging(true);
      const data = JSON.stringify(payload);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", data);
      const target = e.target as HTMLElement;
      setOffset(target);
    };
  const handleDragEnd: DragEventHandler = (e) => {
    setIsDragging(false);
    e.dataTransfer.clearData();
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
  } as const;
}

export function useDrop<T>() {
  const [overlapping, setOverlapping] = useState<"top" | "bottom">();
  const dragEnterLeave = useRef(0);
  let currentFrame: number;

  const handleDragOver: DragEventHandler = (e) => {
    if (e.dataTransfer.types[0] !== "text/plain") {
      return;
    }
    const dropTarget = e.currentTarget.firstElementChild!;
    currentFrame = requestAnimationFrame(() =>
      calcOverlapping(dropTarget, e.clientY)
    );
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
    dragEnterLeave.current = 0;
    cancelAnimationFrame(currentFrame);
    e.preventDefault();
  };

  const handleDragEnter: DragEventHandler = () => dragEnterLeave.current++;
  const handleDragLeave: DragEventHandler = () => {
    dragEnterLeave.current--;
    if (dragEnterLeave.current === 0) {
      cancelAnimationFrame(currentFrame);
      currentFrame = requestAnimationFrame(() => setOverlapping(undefined));
    }
  };

  const calcOverlapping = (dropTarget: Element, clientY: number) => {
    const dropTargetRect = dropTarget?.getBoundingClientRect();
    if (!dropTargetRect) {
      return;
    }
    let y = clientY - dropTargetRect.top;
    const newOverlapping = y <= dropTargetRect.height / 2 ? "top" : "bottom";
    setOverlapping(newOverlapping);
  };

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
