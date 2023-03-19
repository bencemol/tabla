"use client";

import { useDrag, useDrop } from "@/app/lib/drag-n-drop";
import { IconPlus } from "@tabler/icons-react";
import { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";
import "./Draggable.css";

type Props<Item extends unknown, Tag extends keyof JSX.IntrinsicElements> = {
  item: Item;
  onMove: (data: Item, over?: "top" | "bottom") => void;
  tag?: ComponentType | keyof JSX.IntrinsicElements;
  className?: string;
  children?: ReactNode;
} & Omit<JSX.IntrinsicElements[Tag], keyof SVGProps<Tag>>;

export default function Draggable<
  Item extends unknown,
  Tag extends keyof JSX.IntrinsicElements = "li"
>({
  item,
  onMove,
  tag: Wrapper = "li",
  className = "",
  children,
  ...props
}: Props<Item, Tag>) {
  const [isDragging, handleDragStart, handleDragEnd] = useDrag<Item>();
  const [
    overlapping,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  ] = useDrop<Item>();

  const isOverlapping = overlapping && !isDragging;
  const overlappingClass = `over-${overlapping}`;

  return (
    <Wrapper
      draggable
      onDragStart={handleDragStart(item)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop(onMove)}
      className={`${isOverlapping ? overlappingClass : ""} ${
        isDragging ? "dragging opacity-50" : ""
      } grid relative transition-transform [&>*]:transition-transform ${className}`}
      {...props}
    >
      {children}
      {/* {isOverlapping ? (
        <Placeholder style={{ height: "var(--drag-over-offset)" }} />
      ) : null} */}
    </Wrapper>
  );
}

function Placeholder({ style }: { style?: CSSProperties }) {
  return (
    <div className="mb-3 absolute w-full grid place-items-center" style={style}>
      <IconPlus />
    </div>
  );
}
