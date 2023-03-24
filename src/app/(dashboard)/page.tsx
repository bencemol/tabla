import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <section className="p-4 space-x-4">
        <Link
          href="/api/auth/signin"
          className="border-2 rounded-md p-4 hover:bg-neutral-200 transition-colors"
        >
          Login
        </Link>
      </section>
    </main>
  );
}
