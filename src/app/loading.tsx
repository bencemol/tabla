import Button from "@/components/button/Button";
import { Separator } from "@/components/separator/Separator";

export default function Loading() {
  return (
    <section className="p-4 pt-12 pb-48 flex justify-center">
      <div className="w-full h-max max-w-xl space-y-4">
        <h1 className="w-full max-w-[14rem] rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </h1>
        <div className="space-y-12">
          <p className="w-full max-w-[12rem] rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
            {"\u00A0"}
          </p>
          <Button
            variant="primary"
            className="w-full justify-center !border-transparent !bg-zinc-200 dark:!bg-zinc-800 animate-pulse"
          />
          <div className="space-y-12">
            {new Array(5).fill(0).map((_, index) => (
              <Card key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card() {
  return (
    <div className="block border-2 border-t-8 border-zinc-200 dark:border-zinc-800 space-y-4 rounded-md p-4 overflow-hidden">
      <h2 className="w-full max-w-[14rem] rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
        {"\u00A0"}
      </h2>
      <Separator />
      <div className="flex gap-2 justify-evenly flex-wrap">
        {new Array(3).fill(0).map((_, index) => (
          <div key={index} className="last:text-right max-w-[20ch]">
            <small className="w-32 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
              {"\u00A0"}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
