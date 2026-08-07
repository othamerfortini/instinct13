"use client";

import { type ReactNode } from "react";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";

/**
 * LayoutContainer
 *
 * Presentational layout shell for the Instinct 13 website.
 *
 * - Pure presentational; no business logic.
 * - Conditionally renders GlassNav based on `navigationVisible`.
 * - Renders Footer when navigation is visible (i.e., on all content pages).
 * - Semantic HTML landmarks for accessibility.
 */

export interface LayoutContainerProps {
  /** Page content to render in the main area */
  children: ReactNode;
  /** Whether the navigation bar is visible (gated on homepage State 3) */
  navigationVisible?: boolean;
}

export function LayoutContainer({
  children,
  navigationVisible = false,
}: LayoutContainerProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <GlassNav visible={navigationVisible} />

      {/* Main content area */}
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>

      {navigationVisible && <Footer />}
    </div>
  );
}
