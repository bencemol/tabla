import Sidebar from "@/components/sidebar/Sidebar";

type BoardsProps = {
  children: React.ReactNode;
};

export default async function BoardsLayout({ children }: BoardsProps) {
  return (
    <main className="sm:grid grid-cols-[auto_minmax(0,1fr)] min-h-screen bg-white dark:bg-zinc-900">
      {/* @ts-expect-error Async Server Component */}
      <Sidebar />
      {children}
    </main>
  );
}
