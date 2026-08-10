import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AmbientCanvas } from "@/components/ui/AmbientCanvas";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageLoader } from "@/components/ui/PageLoader";
import { IntentProvider } from "@/components/providers/IntentProvider";
import { AdaptiveExperience } from "@/components/ui/AdaptiveExperience";
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
        <IntentProvider>
          {/* Cinematic loading screen — exits after ~1.1 s */}
          <PageLoader />

          {/* Ambient particle field */}
          <AmbientCanvas />

          {/* Cursor-reactive gradient background */}
          <AnimatedBackground />

          <AdaptiveExperience />

          {/* Custom magnetic cursor */}
          <CustomCursor />

          {children}
        </IntentProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
