/* eslint-disable @next/next/no-img-element */

type LogoProps = {
  variant?: "full" | "logo-only";
};

export default function Logo({ variant = "logo-only" }: LogoProps) {
  return (
    <h1 className="flex gap-2 items-center">
      <img
        src="/tabla_logo_light.svg"
        alt="Tábla logo"
        className="hidden w-10 aspect-square dark:block"
      />
      <img
        src="/tabla_logo_dark.svg"
        alt="Tábla logo"
        className="w-10 aspect-square dark:hidden"
      />
      {variant === "full" && <span>Tábla</span>}
    </h1>
  );
}
