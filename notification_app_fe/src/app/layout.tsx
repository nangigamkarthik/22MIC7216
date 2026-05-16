import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stage 1 Priority Inbox",
  description: "Simple Stage 1 frontend output",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
