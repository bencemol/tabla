import BoardList from "@/components/board/BoardList";
import SearchInput from "@/components/search/SearchInput";
import { mulberry32 } from "@/lib/random";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
      <div className="space-y-12">
        <SearchInput />
        <div className="w-full h-max max-w-xl space-y-4">
          <h1>
            {greeting} {session.user?.name} 👋
          </h1>
          <BoardList />
        </div>
      </div>
    </section>
  );
}
