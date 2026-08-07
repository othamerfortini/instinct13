import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AmbientCanvas } from "@/components/ui/AmbientCanvas";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageLoader } from "@/components/ui/PageLoader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body>
        {/* Cinematic loading screen — exits after ~1.1 s */}
        <PageLoader />

        {/* Ambient particle field */}
        <AmbientCanvas />

        {/* Cursor-reactive gradient background */}
        <AnimatedBackground />

        {/* Custom magnetic cursor */}
        <CustomCursor />

        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
