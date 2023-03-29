import { DragEventHandler, useEffect, useRef, useState } from "react";

export function useDrag<T>() {
  const [isDragging, setIsDragging] = useState(false);
  const scrollBox = useRef<HTMLElement>();
  const scrollBoxRect = useRef<DOMRect>();
  const scrollInterval = useRef<ReturnType<typeof setInterval>>();
  let scrollByY = 0;
  let scrollByX = 0;

  const handleDragStart: (payload: T) => DragEventHandler =
    (payload) => (e) => {
      setIsDragging(true);
      const data = JSON.stringify(payload);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", data);
      const target = e.target as HTMLElement;
      setOffset(target);
      const scrollBoxElement = document.querySelector(
        "#scrollBox"
      ) as HTMLElement;
      scrollBox.current = scrollBoxElement;
      scrollBoxRect.current = scrollBoxElement?.getBoundingClientRect();
    };

  const handleDrag: DragEventHandler = (e) => {
    if (!scrollBoxRect.current) {
      return;
    }
    const { clientX, clientY } = e;
    const { top, right, bottom, left, width, height } = scrollBoxRect.current;
    const threshold = 0.1;
    const maxVelocity = 4;
    const thresholdX = width * threshold;
    const thresholdY = height * threshold;
    // up
    if (clientY < top + thresholdY) {
      scrollByX = 0;
      scrollByY = -((thresholdY - (clientY - top)) / thresholdY) * maxVelocity;
      startScrolling();
    }
    // down
    else if (clientY > bottom - thresholdY) {
      scrollByX = 0;
      scrollByY =
        ((thresholdY - (bottom - clientY)) / thresholdY) * maxVelocity;
      startScrolling();
    }
    // right
    else if (clientX > right - thresholdX) {
      scrollByY = 0;
      scrollByX = ((thresholdX - (right - clientX)) / thresholdX) * maxVelocity;
      startScrolling();
    }
    // left
    else if (clientX < left + thresholdX) {
      scrollByY = 0;
      scrollByX = -((thresholdX - (clientX - left)) / thresholdX) * maxVelocity;
      startScrolling();
    }
    // stop
    else {
      stopScrolling();
    }
  };

  const handleDragEnd: DragEventHandler = (e) => {
    stopScrolling();
    setIsDragging(false);
    e.dataTransfer.clearData();
  };

  const stopScrolling = () => {
    if (scrollInterval.current === undefined) {
      return;
    }
    clearInterval(scrollInterval.current);
    scrollInterval.current = undefined;
    scrollByX = 0;
    scrollByY = 0;
  };

  const startScrolling = () => {
    if (scrollInterval.current !== undefined) {
      return;
    }
    scrollInterval.current = setInterval(() => {
      requestAnimationFrame(() =>
        scrollBox.current?.scrollBy({ top: scrollByY, left: scrollByX })
      );
    });
  };

  useEffect(() => {
    const interval = scrollInterval.current;
    return () => clearInterval(interval);
  }, []);

  return {
    isDragging,
    handleDragStart,
    handleDrag,
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
