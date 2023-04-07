import {
  ListDragDirection,
  ListDragOffsetDirection,
  useDrag,
  useDrop,
} from "@/lib/drag-n-drop";
import { ReactNode, SVGProps } from "react";
import "./Draggable.css";

type Props<
  Item extends unknown,
  Tag extends keyof JSX.IntrinsicElements,
  Dir extends ListDragDirection
> = {
  item: Item;
  onDrop: (data: Item, over?: ListDragOffsetDirection<Dir>) => void;
  dragContext?: string;
  direction?: Dir;
  className?: string;
  children?: ReactNode;
} & Omit<JSX.IntrinsicElements[Tag], keyof SVGProps<Tag>>;

export default function Draggable<
  Item extends unknown,
  Dir extends ListDragDirection,
  Tag extends keyof JSX.IntrinsicElements = "li"
>({
  item,
  onDrop,
  dragContext = "",
  direction = "vertical" as Dir,
  className = "",
  children,
  ...props
}: Props<Item, Tag, Dir>) {
  const {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleMouseDown,
    handleTouchStart,
    dragTargetRef,
  } = useDrag<Item>(dragContext);
  const {
    overlapping,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDrop(dragContext, direction);

  const isOverlapping = overlapping && !isDragging;
  const overlappingClass = `over-${overlapping}`;

  return (
    <li
      draggable
      ref={dragTargetRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={handleDragStart(item)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop(onDrop)}
      className={`grid relative transition-transform [&>*]:transition-transform ${
        isOverlapping ? overlappingClass : ""
      } ${isDragging ? "dragging opacity-50" : ""} ${className}`}
      {...props}
    >
      {children}
    </li>
  );
}

export function DropZone<Item extends any, Dir extends ListDragDirection>({
  onDrop,
  dragContext = "",
  direction = "vertical" as Dir,
  children,
  className = "",
}: {
  onDrop: (data: Item, over?: ListDragOffsetDirection<Dir>) => void;
  dragContext?: string;
  direction?: Dir;
  children?: React.ReactNode;
  className?: string;
}) {
  const { handleDragOver, handleDragEnter, handleDragLeave, handleDrop } =
    useDrop(dragContext, direction);
  return (
    <div
      draggable={false}
      className={className}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop(onDrop)}
    >
      {children}
    </div>
  );
}
