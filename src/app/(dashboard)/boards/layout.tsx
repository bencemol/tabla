import Sidebar from "@/components/sidebar/Sidebar";

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col sm:grid grid-cols-[auto_minmax(0,1fr)] min-h-screen">
      {/* @ts-expect-error Async Server Component */}
      <Sidebar />
      {children}
    </main>
  );
}
