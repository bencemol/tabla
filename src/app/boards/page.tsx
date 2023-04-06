import CreateBoard from "@/components/board/CreateBoard";
import { Separator } from "@/components/separator/Separator";
import { getServerSessionUser, isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { mulberry32 } from "@/lib/random";
import { Board } from "@/models/board";
import { TaskStateWithTasks } from "@/models/task-state";
import { getServerSession } from "next-auth";
import Link from "next/link";
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

async function getStates(boardId: string) {
  if (!(await isAuthorized(boardId))) {
    redirect("/");
  }
  const data = await db.taskState.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
    include: { tasks: true },
  });
  return TaskStateWithTasks.array().parse(data);
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
        <div className="space-y-12">
          <p>Here&apos;s a list of all your Boards ({boards.length}):</p>
          <CreateBoard className="w-full justify-center" />
          <div className="space-y-12">
            {boards.map((board) => (
              /* @ts-expect-error Async Server Component */
              <Card key={board.id} board={board} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

async function Card({ board }: { board: Board }) {
  const states = await getStates(board.id);

  return (
    <Link
      href={`/boards/${board.id}`}
      className="block border-2 border-t-8 space-y-4 rounded-md p-4 shadow-md overflow-hidden text-ellipsis break-words"
    >
      <h2 className="text-center">{board.name}</h2>
      <Separator />
      <div className="flex gap-2 justify-evenly flex-wrap">
        {states.map((state) => (
          <div
            key={state.id}
            className="uppercase last:text-right max-w-[20ch] shrink"
          >
            <small className="block whitespace-nowrap text-ellipsis overflow-hidden">
              <strong>{state.tasks.length}</strong> {state.name}
            </small>
          </div>
        ))}
      </div>
    </Link>
  );
}
