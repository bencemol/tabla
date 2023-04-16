import BoardList from "@/components/board/BoardList";
import { mulberry32 } from "@/lib/random";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Boards",
};

const greetings = ["Hey", "Hello", "Hi", "Howdy", "G'day", "Good day"];

export default async function Boards() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const rand = mulberry32(new Date().getDay());
  const greeting = greetings[Math.floor(rand() * greetings.length)];

  return (
    <section className="p-4 pt-12 pb-48 flex justify-center">
      <div className="w-full max-w-xl h-max space-y-4">
        <h1>
          {greeting} {session.user?.name} 👋
        </h1>
        <BoardList />
      </div>
    </section>
  );
}
