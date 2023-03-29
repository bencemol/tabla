/* eslint-disable @next/next/no-img-element */

export default function Logo({ className = "" }) {
  return (
    <h1 className={`flex gap-2 items-center ${className}`}>
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
  );
}
