import {
  DragEventHandler,
  MouseEventHandler,
  TouchEventHandler,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const DragContext = createContext<ReturnType<
  typeof useState<string>
> | null>(null);

export function useDrag<T>(dragContextId: string) {
  const [isDragging, setIsDragging] = useState(false);
  const scrollBox = useRef<HTMLElement>();
  const scrollBoxRect = useRef<DOMRect>();
  const scrollInterval = useRef<ReturnType<typeof setInterval>>();
  let scrollByY = 0;
  let scrollByX = 0;
  const mouseDownTargetRef = useRef<HTMLElement>();
  const dragTargetRef = useRef<HTMLLIElement>(null);
  const [_, setDragContext] = useContext(DragContext)!;

  const handleMouseDown: MouseEventHandler = (e) =>
    (mouseDownTargetRef.current = e.target as HTMLElement);

  const handleTouchStart: TouchEventHandler = (e) =>
    (mouseDownTargetRef.current = e.target as HTMLElement);

  const handleDragStart: (payload: T) => DragEventHandler =
    (payload) => (e) => {
      const dragHandle = dragTargetRef?.current?.querySelector("#dragHandle");
      const mouseDownTarget = mouseDownTargetRef.current;
      if (
        dragHandle &&
        mouseDownTarget &&
        !dragHandle.contains(mouseDownTarget)
      ) {
        e.preventDefault();
        return false;
      }
      e.stopPropagation();
      setDragContext(dragContextId);
      setIsDragging(true);
      const data = JSON.stringify(payload);
      e.dataTransfer.clearData();
      e.dataTransfer.dropEffect = "none";
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
    return;
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
    setDragContext(undefined);
    removeOffset();
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
    handleMouseDown,
    handleTouchStart,
    dragTargetRef,
  } as const;
}

type Vertical = "vertical";

type Horizontal = "horizontal";

export type ListDragDirection = Vertical | Horizontal;

export type ListDragOffsetDirection<Option extends ListDragDirection> =
  Option extends Vertical
    ? "top" | "bottom"
    : Option extends Horizontal
    ? "left" | "right"
    : never;

function isVertical(direction: ListDragDirection): direction is Vertical {
  return direction === "vertical";
}

function isHorizontal(direction: ListDragDirection): direction is Horizontal {
  return direction === "horizontal";
}

export function useDrop<D extends ListDragDirection>(
  dragContextId: string,
  direction: D
) {
  const [overlapping, setOverlapping] = useState<ListDragOffsetDirection<D>>();
  // const dragEnterLeave = useRef(0);
  const dragEnteredElements = useRef(new Set());
  const [dragContext, setDragContext] = useContext(DragContext)!;
  let currentFrame: number;

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault();
    if (
      e.dataTransfer.types[0] !== "text/plain" ||
      dragContext !== dragContextId ||
      // dragEnterLeave.current === 0 // firefox fires dragover after drop 😤
      dragEnteredElements.current.size === 0
    ) {
      return false;
    }
    const dropTarget = e.currentTarget.firstElementChild!;
    currentFrame = requestAnimationFrame(() =>
      calcOverlapping(dropTarget, e.clientX, e.clientY)
    );
  };

  const handleDrop: (
    callback: (data: any, over?: ListDragOffsetDirection<D>) => void
  ) => DragEventHandler = (callback) => (e) => {
    if (dragContext !== dragContextId) {
      return false;
    }
    let data: any;
    try {
      data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data) {
        callback(data, overlapping);
      }
    } catch {}
    removeOffset();
    cancelAnimationFrame(currentFrame);
    currentFrame = requestAnimationFrame(() => setOverlapping(undefined));
    // dragEnterLeave.current = 0;
    dragEnteredElements.current.clear();
    setDragContext(undefined);
    e.preventDefault();
  };

  const handleDragEnter: DragEventHandler = (e) => {
    e.preventDefault();
    // firefox shenanigans again...
    if ((e.relatedTarget as HTMLElement)?.nodeType == 3) return;
    if (e.target === e.relatedTarget) return;
    dragEnteredElements.current.add(e.target);
    // dragEnterLeave.current++;
  };
  const handleDragLeave: DragEventHandler = (e) => {
    // dragEnterLeave.current--;
    dragEnteredElements.current.delete(e.target);
    // if (dragEnterLeave.current === 0) {
    if (dragEnteredElements.current.size === 0) {
      cancelAnimationFrame(currentFrame);
      currentFrame = requestAnimationFrame(() => setOverlapping(undefined));
    }
  };

  const calcOverlapping = (
    dropTarget: Element,
    clientX: number,
    clientY: number
  ) => {
    const dropTargetRect = dropTarget?.getBoundingClientRect();
    if (!dropTargetRect) {
      return;
    }
    if (isVertical(direction)) {
      const y = clientY - dropTargetRect.top;
      const newOverlapping: ListDragOffsetDirection<Vertical> =
        y <= dropTargetRect.height / 2 ? "top" : "bottom";
      setOverlapping(newOverlapping as ListDragOffsetDirection<D>);
    }
    if (isHorizontal(direction)) {
      const x = clientX - dropTargetRect.left;
      const newOverlapping: ListDragOffsetDirection<Horizontal> =
        x <= dropTargetRect.width / 2 ? "left" : "right";
      setOverlapping(newOverlapping as ListDragOffsetDirection<D>);
    }
  };

  useEffect(() => {
    if (!dragContext) {
      setOverlapping(undefined);
    }
  }, [dragContext]);

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
  const offsetX = rect.width;
  const offsetY = rect.height;
  document.documentElement.style.setProperty(
    "--drag-over-offset-x",
    `${offsetX}px`
  );
  document.documentElement.style.setProperty(
    "--drag-over-offset-y",
    `${offsetY}px`
  );
};

const removeOffset = () => {
  document.documentElement.style.removeProperty("--drag-over-offset-x");
  document.documentElement.style.removeProperty("--drag-over-offset-y");
};
