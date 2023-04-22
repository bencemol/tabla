import GlobalSearch from "@/components/search/GlobalSearch";
import { PropsWithChildren } from "react";

export default function SearchLayout({ children }: PropsWithChildren) {
  return (
    <section className="p-4 pt-12 pb-48 flex justify-center">
      <div className="w-full h-max max-w-xl space-y-4">
        <GlobalSearch />
      </div>
    </section>
  );
}
