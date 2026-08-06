"use client";

import { type ReactNode } from "react";

/**
 * LayoutContainer
 *
 * Presentational layout shell for the Instinct 13 website.
 *
 * - Pure presentational; no business logic.
 * - Conditionally renders navigation based on `navigationVisible`.
 * - Fixed navigation links per approved Information Architecture.
 * - Semantic HTML landmarks for accessibility.
 */

export interface LayoutContainerProps {
  /** Page content to render in the main area */
  children: ReactNode;
  /** Whether the navigation bar is visible (gated on homepage State 3) */
  navigationVisible?: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/the-circle", label: "The Circle" },
  { href: "/the-mirror", label: "The Mirror" },
  { href: "/contact", label: "Contact" },
] as const;

export function LayoutContainer({
  children,
  navigationVisible = false,
}: LayoutContainerProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Navigation: hidden during homepage sequence, fixed after State 3 */}
      {navigationVisible && (
        <header className="fixed inset-x-0 top-0 z-50">
          <nav aria-label="Primary navigation">
            <ul className="flex items-center justify-center gap-6 px-4 py-4 sm:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={[
                      "min-h-[44px] min-w-[44px] inline-flex items-center",
                      "text-sm font-medium tracking-wide",
                      "transition-opacity duration-150 hover:opacity-70",
                      "focus-visible:outline-2 focus-visible:outline-offset-2",
                    ].join(" ")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
      )}

      {/* Main content area */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}
