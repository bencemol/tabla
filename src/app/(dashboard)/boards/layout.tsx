import Sidebar from "@/components/sidebar/Sidebar";

type BoardsProps = {
  children: React.ReactNode;
};

export default async function BoardsLayout({ children }: BoardsProps) {
  return (
    <main className="flex flex-col sm:grid grid-cols-[auto_minmax(0,1fr)] min-h-screen">
      {/* @ts-expect-error Async Server Component */}
      <Sidebar />
      <section className="grow flex flex-col max-h-screen">{children}</section>
    </main>
  );
}
