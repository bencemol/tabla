import GlobalSearch from "@/components/search/GlobalSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function Search() {
  return (
    <section className="p-4 pt-12 pb-48 flex justify-center">
      <div className="w-full h-max max-w-xl space-y-4">
        <GlobalSearch />
      </div>
    </section>
  );
}
