"use client";

import { useRef } from "react";

export function GhostColumn({ index }: { index: number }) {
  const rand = useRef(mulberry32(index));
  const titleWidth = useRef(Math.floor(rand.current() * 120 + 120));

  return (
    <section className="flex flex-col">
      <header className="h-14 pb-3">
        <h5
          className="rounded-md bg-zinc-800"
          style={{ width: titleWidth.current }}
        >
          &nbsp;
        </h5>
      </header>
      <ul>
        {Array(16)
          .fill(0)
          .map((_, i) => (
            <li key={i}>
              <GhostTask index={(index + i) * i} />
            </li>
          ))}
      </ul>
    </section>
  );
}

export function GhostTask({ index }: { index: number }) {
  const rand = useRef(mulberry32(index));
  const titleWidth = useRef(Math.floor(rand.current() * 120 + 120));
  const descriptionLines = useRef(Math.floor(rand.current() * 2 + 1));

  return (
    <div className="mb-3 p-2 rounded-md border-2 border-t-8 space-y-2">
      <h3
        className="rounded-md bg-zinc-800"
        style={{ width: titleWidth.current }}
      >
        &nbsp;
      </h3>
      {Array(descriptionLines.current)
        .fill(0)
        .map((_, i) => (
          <p key={i} className="rounded-md bg-zinc-800 w-full">
            &nbsp;
          </p>
        ))}
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
