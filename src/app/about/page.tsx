import { GhostBoard } from "@/components/ghost/GhostBoard";
import Logo from "@/components/logo/Logo";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorldWww,
} from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <main className="min-h-screen relative">
      <GhostBoard />
      <section className="p-4 absolute inset-0 grid place-items-center">
        <article className="w-full max-w-md space-y-4 border-2 border-t-8 rounded-md p-8 text-center grid gap-2 justify-center shadow-xl bg-white dark:bg-zinc-900 animate-in slide-in-from-bottom-3">
          <header className="mx-auto">
            <Link href="/">
              <Logo />
            </Link>
          </header>
          <section className="space-y-2">
            <h5>Built by</h5>
            <p>Bence Molnár</p>
          </section>
          <section className="space-y-2">
            <h5>with</h5>
            <ul className="space-y-1">
              <li>
                <Link href="https://beta.nextjs.org/">Next.js 13 Beta</Link>
              </li>
              <li>
                <Link href="https://tabler-icons.io/">Tabler Icons</Link>
              </li>
              <li>
                <Link href="https://next-auth.js.org/">NextAuth.js</Link>
              </li>
              <li>
                <Link href="https://swr.vercel.app/">SWR</Link>
              </li>
              <li>
                <Link href="https://zod.dev/">Zod</Link>
              </li>
            </ul>
          </section>
          <footer className="space-y-2">
            <h5>Check me out on</h5>
            <address className="grid gap-4 grid-flow-col auto-cols-min justify-between">
              <Link href="https://www.linkedin.com/in/bence-moln%C3%A1r-38439219a">
                <IconBrandLinkedin />
              </Link>
              <Link href="https://github.com/bencemol">
                <IconBrandGithub />
              </Link>
              <Link href="https://cv.bmolnar.dev">
                <IconWorldWww />
              </Link>
            </address>
          </footer>
        </article>
      </section>
    </main>
  );
}
