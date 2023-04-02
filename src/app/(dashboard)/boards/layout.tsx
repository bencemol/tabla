import Sidebar from "@/components/sidebar/Sidebar";

type BoardsProps = {
  children: React.ReactNode;
};

export default async function BoardsLayout({ children }: BoardsProps) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Sidebar />
      <section className="grow flex flex-col">{children}</section>
    </>
  );
}
