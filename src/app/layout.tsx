import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Tábla", template: "%s | Tábla" },
  description: "An experimental Kanban board",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    other: [
      {
        url: "/favicon.png",
        type: "image/png",
        rel: "alternate icon",
        sizes: "any",
      },
    ],
    apple: "/favicon.png",
    shortcut: "/tabla_logo_dark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="text-sm">
      <body className={inter.className + " bg-white dark:bg-zinc-900"}>
        {children}
      </body>
    </html>
  );
}
