import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Tábla", template: "%s | Tábla" },
  description: "An experimental Kanban board",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/tabla_logo_dark.svg",
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className +
          "flex flex-col sm:grid grid-cols-[auto_minmax(0,1fr)] min-h-screen bg-white dark:bg-zinc-900"
        }
      >
        {children}
      </body>
    </html>
  );
}
