import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yangi Lotin — Uç alifbo. Bitta klaviatura.",
  description:
    "Kirill, eski lotin va yangi ōzbek alifbosida tez va qulay yozing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
