import {
  createContext,
  Dispatch,
  DragEventHandler,
  SetStateAction,
  useContext,
  useState,
} from "react";

export function useDrag<T>() {
  const [isDragging, setIsDragging] = useState(false);
  const { setDragTarget } = useContext(DragContext);
  const handleDragStart: (payload: T) => DragEventHandler =
    (payload) => (e) => {
      setIsDragging(true);
      setDragTarget(e.target as HTMLElement);
      const data = JSON.stringify(payload);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", data);
    };
  const handleDragEnd: DragEventHandler = (e) => {
    setIsDragging(false);
    e.dataTransfer.clearData();
  };

  return [isDragging, handleDragStart, handleDragEnd] as const;
}

export function useDrop<T>() {
  const [overlapping, setOverlapping] = useState<"top" | "bottom">();
  const [_, setDragEnterLeave] = useState(0);
  const { dragTarget } = useContext(DragContext);
  const handleDragOver: DragEventHandler = (e) => {
    if (e.dataTransfer.types[0] !== "text/plain") {
      return;
    }
    const target = e.currentTarget as HTMLElement;
    const rect = target.firstElementChild!.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setOverlapping(y <= rect.height / 2 ? "top" : "bottom");
    setOffset(dragTarget, target);
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
    removeOffset(e.currentTarget as HTMLElement);
    setOverlapping(undefined);
    setDragEnterLeave(0);
    e.preventDefault();
  };

  const handleDragEnter: DragEventHandler = () => {
    setDragEnterLeave((val) => ++val);
  };

  const handleDragLeave: DragEventHandler = ({ currentTarget }) =>
    setDragEnterLeave((dragEnterLeave) => {
      dragEnterLeave--;
      console.log({ dragEnterLeave });
      if (dragEnterLeave === 0) {
        removeOffset(currentTarget as HTMLElement);
        setOverlapping(undefined);
      }
      return dragEnterLeave;
    });

  return [
    overlapping,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  ] as const;
}

const setOffset = (dragTarget?: HTMLElement, dragOverTarget?: HTMLElement) => {
  if (!dragTarget || !dragOverTarget) {
    return;
  }
  const rect = dragTarget.firstElementChild!.getBoundingClientRect();
  dragOverTarget.parentElement!.style.setProperty(
    "--drag-over-offset",
    `${rect.height}px`
  );
};

const removeOffset = (target: HTMLElement) =>
  target.parentElement!.style.removeProperty("--drag-over-offset");

type DragContextType = {
  dragTarget: HTMLElement | undefined;
  setDragTarget: Dispatch<SetStateAction<HTMLElement | undefined>>;
};

export const DragContext = createContext<DragContextType>(
  {} as DragContextType
);
