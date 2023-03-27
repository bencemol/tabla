"use client";

import { useEffect, useRef } from "react";

const easeIn = "cubic-bezier(0.4, 0, 1, 1)";
const easeOut = "cubic-bezier(0, 0, 0.2, 1)";
const easeInOut = "cubic-bezier(0.4, 0, 0.2, 1)";

function dragBefore(fromSelector: string, toSelector: string) {
  const from = document.querySelector(fromSelector) as HTMLElement;
  const to = document.querySelector(toSelector) as HTMLElement;
  let taskElementsAbove = document.querySelectorAll(
    `${toSelector}, ${toSelector} ~ li:has(~ #${from.id})`
  );
  const tasksAbove = Array.from(taskElementsAbove);
  tasksAbove.reverse();
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const deltaY = fromRect.top - toRect.top;
  from.style["zIndex"] = "10";
  const liftOptions = {
    delay: 4000,
    duration: 300,
    fill: "forwards",
    easing: easeOut,
  } as KeyframeAnimationOptions;
  const liftFrames = [
    { transform: "translate(0, 0)" },
    { transform: "translate(10%, 0)" },
  ] as Keyframe[];
  const dragOptions = {
    duration: deltaY * 2.5,
    fill: "forwards",
    easing: easeInOut,
  } as KeyframeAnimationOptions;
  const dragFrames = [
    {
      transform: `translate(10%, ${-deltaY}px)`,
    },
  ] as Keyframe[];
  const staggerOptions = {
    duration: 600,
    easing: easeInOut,
    fill: "forwards",
  } as KeyframeAnimationOptions;
  const staggerFrames = [
    { transform: "translateY(0)" },
    { transform: `translateY(${fromRect.height}px)` },
  ];
  const dropOptions = {
    duration: 300,
    fill: "forwards",
    easing: easeIn,
  } as KeyframeAnimationOptions;
  const dropFrames = [
    { transform: `translate(0, ${-deltaY}px)` },
  ] as Keyframe[];
  const liftAnimation = from.animate(liftFrames, liftOptions);
  liftAnimation.pause();
  const dragAnimation = from.animate(dragFrames, dragOptions);
  dragAnimation.pause();
  const staggerAnimation = tasksAbove.map((task, i) => {
    const animation = task.animate(staggerFrames, {
      ...staggerOptions,
      delay: 300 + i * 150,
    });
    animation.pause();
    return animation;
  });
  const dropAnimation = from.animate(dropFrames, dropOptions);
  dropAnimation.pause();
  liftAnimation.finished
    .then(() => {
      dragAnimation.play();
      staggerAnimation.forEach((animation) => animation.play());
      return dragAnimation.finished;
    })
    .then(() => {
      dropAnimation.play();
      return dropAnimation.finished;
    })
    .catch(() => {});

  dropAnimation.addEventListener("finish", () => {
    liftAnimation.cancel();
    dragAnimation.cancel();
    staggerAnimation.forEach((animation) => animation.cancel());
    dropAnimation.cancel();
    from.removeAttribute("style");
    to.parentElement!.insertBefore(from, to);
  });

  return {
    play: () => liftAnimation.play(),
    cancel: () => {
      liftAnimation.cancel();
      dragAnimation.cancel();
      staggerAnimation.forEach((animation) => animation.cancel());
      dropAnimation.cancel();
    },
    animation: dropAnimation,
    finished: dropAnimation.finished,
  };
}

function animateBoard() {
  const frames: [string, string][] = [
    ["#col_2 li:nth-child(10)", "#col_2 li:nth-child(4)"],
    ["#col_0 li:nth-child(9)", "#col_0 li:nth-child(2)"],
    ["#col_1 li:nth-child(10)", "#col_1 li:nth-child(5)"],
    ["#col_3 li:nth-child(12)", "#col_3 li:nth-child(9)"],
    ["#col_4 li:nth-child(6)", "#col_4 li:nth-child(1)"],
  ];
  let timeline: ReturnType<typeof dragBefore>[] = [];
  const play = () => {
    frames.forEach((frame, index) => {
      const animation = dragBefore(...frame);
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
      className="max-h-screen grid justify-center grid-flow-col auto-cols-[20ch] p-4 gap-6 overflow-hidden opacity-5 dark:opacity-20"
    >
      {Array(7)
        .fill(0)
        .map((_, colIndex) => (
          <GhostColumn key={colIndex} index={colIndex}>
            {Array(12)
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
    <ul id={`col_${index}`} className="flex flex-col -translate-y-10">
      {children}
    </ul>
  );
}

export function GhostTask({ index }: { index: number }) {
  const rand = useRef(mulberry32(index));
  const titleWidth = useRef(Math.floor(30 + rand.current() * 70));
  const descriptionLines = useRef(Math.floor(rand.current() * 2 + 1));

  return (
    <div className="p-2 rounded-md border-2 border-t-8 space-y-2 bg-white dark:bg-zinc-900">
      <h3
        className="rounded-md bg-zinc-800"
        style={{ width: titleWidth.current + "%" }}
      >
        &nbsp;
      </h3>
      <div className="space-y-1">
        {Array(descriptionLines.current)
          .fill(0)
          .map((_, i) => (
            <p key={i} className="rounded-md bg-zinc-800 w-full">
              &nbsp;
            </p>
          ))}
      </div>
    </div>
  );
}

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
