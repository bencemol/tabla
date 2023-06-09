export default function Loading() {
  const columns = [[0, 1, 2, 3, 4], [0, 1, 2], [0, 1, 2, 3, 4, 5, 6, 7], []];

  return (
    <section>
      <ul className="mt-4 pb-4 px-4 grid grid-flow-col auto-cols-[minmax(28ch,_35ch)] overflow-hidden animate-in fade-in-90">
        {columns.map((tasks, index) => (
          <Column key={index} tasks={tasks} />
        ))}
      </ul>
    </section>
  );
}

function Column({ tasks }: { tasks: number[] }) {
  return (
    <section className="relative mr-6 flex flex-col">
      <header
        id="dragHandle"
        className="h-14 grid grid-flow-col items-center -m-1 p-1 pb-3 sticky -top-1 z-10 cursor-grab bg-white dark:bg-zinc-900"
      >
        <h5 className="mr-1 line-clamp-2 w-32 rounded-md bg-zinc-200 dark:!bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </h5>
      </header>
      <ul className="grow flex flex-col py-2 mb-10">
        {tasks?.map((_, index) => (
          <Task key={index} />
        ))}
      </ul>
    </section>
  );
}

function Task() {
  return (
    <div className="mb-3 px-3 py-2 rounded-md border-2 border-t-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left">
      <article className="space-y-2">
        <h3 className="w-full max-w-[11rem] rounded-md bg-zinc-200 dark:!bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </h3>
        <p className="w-full max-w-[13rem] rounded-md bg-zinc-200 dark:!bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </p>
        <p className="w-full max-w-[12rem] rounded-md bg-zinc-200 dark:!bg-zinc-800 animate-pulse">
          {"\u00A0"}
        </p>
      </article>
    </div>
  );
}
