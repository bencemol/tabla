import {
  KeyboardEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type ListNavProps = {
  children: React.ReactNode;
  data: unknown;
};

export default function ListNav({ data, children }: ListNavProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const prevIndex = usePrevious(activeIndex);
  const listRef = useRef<HTMLDivElement>(null);
  const listElementsRef = useRef<HTMLElement[]>([]);

  const handleKeyDown: KeyboardEventHandler = (e) => {
    const elements = listElementsRef.current;
    if (e.key === "ArrowDown") {
      setActiveIndex((index) => Math.min(elements.length - 1, index + 1));
    }
    if (e.key === "ArrowUp") {
      setActiveIndex((index) => Math.max(0, index - 1));
    }
    if (e.key === "Enter") {
      listElementsRef.current[activeIndex]?.click();
    }
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    setActiveIndex(-1);
    listElementsRef.current = Array.from(list.querySelectorAll("a"));
  }, [data]);

  useEffect(() => {
    const elements = listElementsRef.current;
    const prev = prevIndex !== undefined ? elements[prevIndex] : undefined;
    const next = elements[activeIndex];
    if (prev) {
      delete prev.dataset.active;
    }
    if (next) {
      next.dataset.active = "true";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div ref={listRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
