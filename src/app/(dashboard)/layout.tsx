import Providers from "@/components/providers/Providers";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.main}>
      <Providers>
        {/* @ts-expect-error Async Server Component */}
        <Sidebar />
        {children}
      </Providers>
    </main>
  );
}
