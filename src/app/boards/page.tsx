import BoardList from "@/components/board/BoardList";
import { getServerSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { mulberry32 } from "@/lib/random";
import { Board } from "@/models/board";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const greetings = ["Hey", "Hello", "Hi", "Howdy", "G'day", "Good day"];

async function getBoards() {
  const user = await getServerSessionUser();
  const data = await db.board.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return Board.array().parse(data);
}

export default async function Boards() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const boards = await getBoards();
  const rand = mulberry32(new Date().getDay());
  const greeting = greetings[Math.floor(rand() * greetings.length)];

  return (
    <section className="p-4 pt-12 pb-48 flex justify-center">
      <div className="w-full h-max max-w-xl space-y-4">
        <h1>
          {greeting} {session.user?.name} 👋
        </h1>
        <BoardList boards={boards} />
      </div>
    </section>
  );
}
