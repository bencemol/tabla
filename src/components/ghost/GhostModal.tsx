type GhostModalProps = {
  children?: React.ReactNode;
};

export default function GhostModal({ children }: GhostModalProps) {
  return (
    <dialog
      open
      className="fixed top-0 w-full max-w-[60ch] mx-auto mt-0 sm:!mt-40 p-6 bg-transparent backdrop:backdrop-blur-sm backdrop:overflow-hidden z-50 animate-in slide-in-from-bottom-3"
    >
      <main className="rounded-md border-2 shadow-lg bg-white dark:bg-zinc-900">
        <form
          autoComplete="off"
          className="relative grid gap-8 p-4 [&>footer]:grid [&>footer]:grid-flow-col [&>footer]:auto-cols-fr [&>footer]:justify-end [&>footer]:flex-wrap [&>footer]:gap-3 [&>footer>button]:justify-center"
        >
          <header className="min-w-0 -m-4 p-4 pb-4 border-t-8 bg-white dark:bg-zinc-900">
            <h2 className="text-ellipsis overflow-hidden w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse">
              {"\u00A0"}
            </h2>
          </header>
          {children}
        </form>
      </main>
    </dialog>
  );
}
