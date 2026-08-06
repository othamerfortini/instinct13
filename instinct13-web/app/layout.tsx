import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instinct 13",
  description:
    "An operating system for understanding human behavior. Observe what is manifesting, understand why it may be emerging, and consciously decide what to cultivate next.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
