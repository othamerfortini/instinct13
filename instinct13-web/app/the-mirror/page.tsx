import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Mirror — Instinct 13",
  description:
    "The Mirror is the symbol-independent framework of the Instinct 13 universe.",
};

export default function TheMirrorPage() {
  return (
    <ContentPage>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        The Mirror
      </h1>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Overview</h2>
        <p className="leading-relaxed text-neutral-300">
          The Mirror is the symbol-independent framework of the Instinct 13
          universe. Where The Circle provides a symbolic vocabulary for
          observation, The Mirror operates without symbols — it observes
          relationships between Manifestations directly.
        </p>
        <p className="leading-relaxed text-neutral-300">
          The Mirror does not require symbolic Collections. It functions as a
          clean observational surface for whatever is present.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Relationship Observations
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Mirror focuses on the relationships between Manifestations — how
          they interact, reinforce, or tension one another. This relational
          view reveals dynamics that symbolic frameworks alone cannot surface.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Symbol-Independence
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Mirror does not depend on the symbolic Collections used by The
          Circle. It operates on a different layer of observation — one that
          remains valid regardless of which symbolic framework a person engages
          with, or none at all.
        </p>
        <p className="leading-relaxed text-neutral-300">
          This makes The Mirror universally applicable across the Instinct 13
          universe.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Intentional Cultivation
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Mirror supports intentional cultivation through reflection. By
          observing how Manifestations relate to one another, a person can
          identify which dynamics to strengthen, which to examine, and which to
          consciously redirect.
        </p>
        <nav aria-label="Related framework" className="mt-4">
          <a
            href="/the-circle"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Explore The Circle →
          </a>
        </nav>
      </section>
    </ContentPage>
  );
}
