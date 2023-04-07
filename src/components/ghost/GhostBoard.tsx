"use client";

import { mulberry32 } from "@/lib/random";
import { useEffect, useRef } from "react";

const easeIn = "cubic-bezier(0.4, 0, 1, 1)";
const easeOut = "cubic-bezier(0, 0, 0.2, 1)";
const easeInOut = "cubic-bezier(0.4, 0, 0.2, 1)";

function liftAnimation(element: HTMLElement) {
  const animation = element.animate(
    [{ transform: "translate(0, 0)" }, { transform: "translate(10%, 0)" }],
    {
      delay: 4000,
      duration: 300,
      fill: "forwards",
      easing: easeIn,
    }
  );
  animation.pause();
  return animation;
}

function dragAnimation(from: HTMLElement, dragDistance: number) {
  const animation = from.animate(
    [
      {
        transform: `translate(10%, ${-dragDistance}px)`,
      },
    ],
    {
      duration: dragDistance * 2.5,
      fill: "forwards",
      easing: easeInOut,
    }
  );
  animation.pause();
  return animation;
}

function staggerAnimation(
  tasks: Element[],
  dragDistance: number,
  draggedElementHeight: number
) {
  const staggerAnimation = tasks.map((task, i) => {
    const animation = task.animate(
      [
        { transform: "translateY(0)" },
        { transform: `translateY(${draggedElementHeight}px)` },
      ],
      {
        duration: 600,
        easing: easeInOut,
        fill: "forwards",
        delay: 300 + (i * dragDistance) / 5.3,
      }
    );
    animation.pause();
    return animation;
  });
  return staggerAnimation;
}

function dropAnimation(el: HTMLElement, dragDistance: number) {
  const animation = el.animate(
    [{ transform: `translate(0, ${-dragDistance}px)` }],
    {
      duration: 300,
      fill: "forwards",
      easing: easeOut,
    }
  );
  animation.pause();
  return animation;
}

function createDragAnimationTimeline(fromSelector: string, toSelector: string) {
  const from = document.querySelector(fromSelector) as HTMLElement;
  const to = document.querySelector(toSelector) as HTMLElement;
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const dragDistance = fromRect.top - toRect.top;
  let taskElementsAbove = document.querySelectorAll(
    `${toSelector}, ${toSelector} ~ li:not(${fromSelector}):not(${fromSelector} ~ *)`
  );
  const tasksAbove = Array.from(taskElementsAbove);
  tasksAbove.reverse();

  from.style["zIndex"] = "10";

  const lift = liftAnimation(from);
  const drag = dragAnimation(from, dragDistance);
  const stagger = staggerAnimation(tasksAbove, dragDistance, fromRect.height);
  const drop = dropAnimation(from, dragDistance);
  lift.finished
    .then(() => {
      drag.play();
      stagger.forEach((animation) => animation.play());
      return drag.finished;
    })
    .then(() => {
      drop.play();
      return drop.finished;
    })
    .catch(() => {});

  drop.addEventListener("finish", () => {
    lift.cancel();
    drag.cancel();
    stagger.forEach((animation) => animation.cancel());
    drop.cancel();
    from.removeAttribute("style");
    to.parentElement!.insertBefore(from, to);
  });

  return {
    play: () => lift.play(),
    cancel: () => {
      lift.cancel();
      drag.cancel();
      stagger.forEach((animation) => animation.cancel());
      drop.cancel();
    },
    animation: drop,
    finished: drop.finished,
  };
}

function animateBoard() {
  const frames: [string, string][] = [
    ["#col_2 li:nth-child(10)", "#col_2 li:nth-child(4)"],
    ["#col_0 li:nth-child(7)", "#col_0 li:nth-child(2)"],
    ["#col_1 li:nth-child(9)", "#col_1 li:nth-child(5)"],
    ["#col_3 li:nth-child(5)", "#col_3 li:nth-child(3)"],
    ["#col_4 li:nth-child(6)", "#col_4 li:nth-child(1)"],
  ];
  let timeline: ReturnType<typeof createDragAnimationTimeline>[] = [];
  const play = () => {
    frames.forEach((frame, index) => {
      const animation = createDragAnimationTimeline(...frame);
      timeline.push(animation);
      if (index > 0) {
        timeline[index - 1].animation.onfinish = () => animation.play();
      }
      if (index === frames.length - 1) {
        timeline[frames.length - 1].animation.onfinish = () => {
          timeline = [];
          play();
        };
      }
    });
    timeline[0].play();
  };
  play();
  return {
    cancel: () => {
      timeline.forEach((animation) => animation.cancel());
    },
  };
}

export function GhostBoard() {
  useEffect(() => {
    const animation = animateBoard();
    return () => {
      animation.cancel();
    };
  }, []);

  return (
    <section
      id="board"
      className="h-screen grid justify-center items-center grid-flow-col auto-cols-[20ch] p-4 gap-6 overflow-hidden opacity-5 dark:opacity-10"
    >
      {Array(7)
        .fill(0)
        .map((_, colIndex) => (
          <GhostColumn key={colIndex} index={colIndex}>
            {Array(12 - Math.abs(colIndex - 3))
              .fill(0)
              .map((_, rowIndex) => (
                <li
                  key={rowIndex}
                  id={`task_${colIndex}_${rowIndex}`}
                  className="relative pb-3"
                >
                  <GhostTask index={(colIndex + rowIndex) * rowIndex} />
                </li>
              ))}
          </GhostColumn>
        ))}
    </section>
  );
}

export function GhostColumn({
  index,
  children,
}: {
  index: number;
  children?: React.ReactNode;
}) {
  return (
    <ul id={`col_${index}`} className="-translate-y-10">
      {children}
    </ul>
  );
}

const taskVariants = [
  "text-black dark:text-zinc-600",
  "text-violet-800",
  "text-orange-800",
  "text-blue-800",
];

export function GhostTask({ index }: { index: number }) {
  const rand = useRef(mulberry32(index));
  const titleWidth = useRef(Math.floor(30 + rand.current() * 70));
  const descriptionLines = useRef(Math.floor(rand.current() * 2 + 1));
  const variant = useRef(Math.floor(rand.current() * taskVariants.length));

  return (
    <div
      className={`px-3 py-2 rounded-md border-2 border-t-8 border-current space-y-2 bg-white dark:bg-zinc-900 ${
        taskVariants[variant.current]
      }`}
    >
      <h3
        className="rounded-md bg-current"
        style={{ width: titleWidth.current + "%" }}
      >
        &nbsp;
      </h3>
      <div className="space-y-1">
        {Array(descriptionLines.current)
          .fill(0)
          .map((_, i) => (
            <p key={i} className="rounded-md bg-current w-full">
              &nbsp;
            </p>
          ))}
      </div>
    </div>
  );
}
