/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/boards" className={className} tabIndex={-1}>
      <h1 className="flex gap-2 items-center">
        <img
          src="/tabla_logo_light.svg"
          alt="Tábla logo"
          className="hidden w-9 aspect-square dark:block"
        />
        <img
          src="/tabla_logo_dark.svg"
          alt="Tábla logo"
          className="w-9 aspect-square dark:hidden"
        />
        <span>Tábla</span>
      </h1>
    </Link>
  );
}
