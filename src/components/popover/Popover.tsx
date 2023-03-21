import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PopoverProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function Popover({ isOpen, children, className }: PopoverProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{
    top: number;
    left: number;
    bottom: number;
    right: number;
  }>();

  useEffect(() => {
    if (!wrapper.current || !isOpen) {
      return;
    }
    const { top, left, bottom, right } =
      wrapper.current.parentElement!.getBoundingClientRect();
    setBounds({ top, left, bottom, right });
  }, [isOpen]);

  return (
    <div ref={wrapper} className="hidden">
      {isOpen &&
        bounds &&
        createPortal(
          <>
            <div
              data-popover
              className={`fixed my-2 p-1 rounded-md border-2 border-black dark:border-neutral-700 shadow-lg z-10 bg-inherit ${className}`}
              style={{ top: `${bounds.bottom}px`, left: `${bounds.left}px` }}
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
