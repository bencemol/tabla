import Header from "@/components/board/Header";
import GlobalSearch from "@/components/search/GlobalSearch";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Search() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return (
    <section>
      <Header session={session} className="sticky top-0 z-10" />
      <section className="p-4 pt-12 pb-48 flex justify-center">
        <div className="w-full h-max max-w-xl space-y-4">
          <GlobalSearch />
        </div>
      </section>
    </section>
  );
}
