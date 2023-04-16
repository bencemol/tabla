import Button from "@/components/button/Button";
import { Separator } from "@/components/separator/Separator";

export default function Loading() {
  return (
    <section className="p-4 pt-12 pb-48 flex justify-center">
      <div className="w-full max-w-xl space-y-12">
        <Button
          variant="primary"
          className="w-full justify-center !bg-zinc-200 dark:!bg-zinc-800 !border-zinc-200 dark:!border-zinc-800 animate-pulse"
          disabled
        />
        <div className="w-full h-max max-w-xl space-y-4">
          <h1 className="w-64 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
            {"\u00A0"}
          </h1>
          <div className="space-y-12">
            <p className="w-72 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
              {"\u00A0"}
            </p>
            <Button className="w-full !border-zinc-200 dark:!border-zinc-800 !bg-zinc-200 dark:!bg-zinc-800 animate-pulse" />
            <div className="space-y-12">
              {new Array(4).fill(0).map((_, index) => (
                <GhostCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GhostCard() {
  return (
    <div className="border-2 border-t-8 space-y-4 rounded-md p-4 !border-zinc-200 dark:!border-zinc-800">
      <h2 className="w-64 mx-auto rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse">
        {"\u00A0"}
      </h2>
      <Separator />
      <div className="flex gap-2 justify-evenly flex-wrap">
        {new Array(3).fill(0).map((_, index) => (
          <small
            key={index}
            className="block w-16 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse"
          >
            {"\u00A0"}
          </small>
        ))}
      </div>
    </div>
  );
}
