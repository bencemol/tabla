import { Board } from "@prisma/client";
import styles from "./page.module.css";
import Sidebar from "./Sidebar";

const boards: Board[] = [
  { id: "1", name: "board 1" },
  { id: "2", name: "board 2" },
  { id: "3", name: "board 3" },
  { id: "4", name: "board 4" },
  { id: "5", name: "board 5" },
  { id: "6", name: "board 6" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.main}>
      <Sidebar boards={boards}></Sidebar>
      {children}
    </main>
  );
}
