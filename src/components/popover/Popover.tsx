"use client";

import {
  CSSProperties,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type VerticalPos = "top" | "bottom";
type HorizontalPos = "left" | "right";

type PopoverProps = {
  isOpen: boolean;
  children: React.ReactNode;
  pos?: `${VerticalPos}-${HorizontalPos}`;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Popover({
  isOpen,
  children,
  pos = "bottom-left",
  className,
  ...props
}: PopoverProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{
    top: number;
    left: number;
    bottom: number;
    right: number;
  }>();
  const [computedStyle, setComputedStyle] = useState<CSSProperties>();

  const computeStyle = () => {
    if (!bounds) {
      return;
    }
    switch (pos) {
      case "bottom-left":
        setComputedStyle({
          top: `${bounds.bottom}px`,
          left: `${bounds.left}px`,
        });
        break;
      case "bottom-right":
        setComputedStyle({
          top: `${bounds.bottom}px`,
          right: `${window.innerWidth - bounds.right}px`,
        });
        break;
      case "top-left":
        setComputedStyle({
          bottom: `${window.innerHeight - bounds.top}px`,
          left: `${bounds.left}px`,
        });
        break;
      case "top-right":
        setComputedStyle({
          bottom: `${window.innerHeight - bounds.top}px`,
          right: `${window.innerWidth - bounds.right}px`,
        });
        break;
      default:
        throw Error("Unknown Popover position:", pos);
    }
  };

  useEffect(() => {
    if (!wrapper.current || !isOpen) {
      return;
    }
    const rect = wrapper.current.parentElement!.getBoundingClientRect();
    const { top, left, bottom, right } = rect;
    setBounds({ top, left, bottom, right });
  }, [isOpen]);

  useEffect(
    () => computeStyle(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pos, bounds?.top, bounds?.left, bounds?.bottom, bounds?.right]
  );

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.removeProperty("overflow");
    }
  }, [isOpen]);

  return (
    <div ref={wrapper} className="hidden">
      {isOpen &&
        bounds &&
        createPortal(
          <>
            <div
              data-popover
              className={`fixed my-2 max-w-[calc(100vw-1rem)] p-1 rounded-md border-2 shadow-lg z-10 bg-inherit animate-in slide-in-from-top-1 ${className}`}
              style={computedStyle}
              {...props}
            >
              {children}
            </div>
            <div className="fixed w-screen h-screen top-0 left-0 z-0"></div>
          </>,
          document.body
        )}
    </div>
  );
}
