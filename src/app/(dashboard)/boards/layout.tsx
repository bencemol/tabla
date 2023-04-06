import Header from "@/components/board/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type BoardsProps = {
  children: React.ReactNode;
};

export default async function BoardsLayout({ children }: BoardsProps) {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return (
    <main className="sm:grid grid-cols-[auto_minmax(0,1fr)] min-h-screen bg-white dark:bg-zinc-900">
      {/* @ts-expect-error Async Server Component */}
      <Sidebar />
      <section>
        <Header session={session} className="sticky top-0 z-10" />
        {children}
      </section>
    </main>
  );
}
