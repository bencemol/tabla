import Header from "@/components/board/Header";
import Providers from "@/components/providers/Providers";
import Sidebar from "@/components/sidebar/Sidebar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Board } from "@/models/board";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getBoards() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }
  const data = await db.board.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return Board.array().parse(data);
}

type BoardsProps = {
  children: React.ReactNode;
};

export default async function BoardsLayout({ children }: BoardsProps) {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const boards = await getBoards();
  const fallback = {
    ["/api/boards"]: boards,
  };

  return (
    <main className="sm:grid grid-cols-[auto_minmax(0,1fr)] min-h-screen bg-white dark:bg-zinc-900">
      <Providers fallback={fallback}>
        <Sidebar />
        <section>
          <Header session={session} className="sticky top-0 z-20" />
          {children}
        </section>
      </Providers>
    </main>
  );
}
