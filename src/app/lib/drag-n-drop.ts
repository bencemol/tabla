import { DragEventHandler, useState } from "react";

export function useDrag<T>() {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart: (payload: T) => DragEventHandler =
    (payload) => (e) => {
      setIsDragging(true);
      const data = JSON.stringify(payload);
      e.dataTransfer.setData("text/plain", data);
    };
  const handleDragEnd: DragEventHandler = (e) => {
    setIsDragging(false);
    e.dataTransfer.clearData();
  };

  return [isDragging, handleDragStart, handleDragEnd] as const;
}

export function useDrop<T>() {
  const [isOverlapping, setIsOverlapping] = useState(false);
  const handleDragOver: DragEventHandler = (e) => {
    if (e.dataTransfer.types[0] === "text/plain") {
      setIsOverlapping(true);
      e.preventDefault();
    }
  };
  const handleDrop: (callback: (data: T) => void) => DragEventHandler =
    (callback) => (e) => {
      let data: T;
      try {
        data = JSON.parse(e.dataTransfer.getData("text/plain"));
        if (data) {
          callback(data);
        }
      } catch {}
      setIsOverlapping(false);
    };

  const handleDragLeave: DragEventHandler = () => setIsOverlapping(false);

  return [isOverlapping, handleDragOver, handleDragLeave, handleDrop] as const;
}
