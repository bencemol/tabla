import styles from "./page.module.css";
import Sidebar from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.main}>
      {/* @ts-expect-error Async Server Component */}
      <Sidebar />
      {children}
    </main>
  );
}
