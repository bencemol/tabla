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
    textArea.style.removeProperty("height");
    const height = Math.max(textArea.scrollHeight, textArea.offsetHeight);
    textArea.style.height = `${height}px`;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(adjustHeight, [textAreaRef.current]);

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
