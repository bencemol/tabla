"use client";

import { TextareaHTMLAttributes, useLayoutEffect, useRef } from "react";

type TextAreaProps = {} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({
  children,
  onChange,
  ...props
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textArea = textAreaRef.current!;
    setTimeout(() => {
      textArea.style.height = "inherit";
      const height = textArea.scrollHeight;
      textArea.style.height = `${height}px`;
    });
  };

  useLayoutEffect(adjustHeight, []);

  return (
    <textarea
      ref={textAreaRef}
      onChange={(e) => {
        adjustHeight();
        onChange?.(e);
      }}
      {...props}
    >
      {children}
    </textarea>
  );
}
