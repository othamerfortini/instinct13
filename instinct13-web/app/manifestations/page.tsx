import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";

export const metadata: Metadata = {
  title: "Manifestations — Instinct 13",
  description:
    "Observe what is manifesting. Understand why it may be emerging. Decide what to cultivate next.",
};

export default function ManifestationsPage() {
  return (
    <ContentPage>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        Manifestations
      </h1>

      <section className="mb-10 space-y-4">
        <p className="leading-relaxed text-neutral-300">
          A Manifestation is a pattern of behavior, thought, or energy that is
          present and active in a person at a given moment.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Instinct 13 does not classify people by their Manifestations. It
          creates frameworks to observe them, understand why they may be
          emerging, and support intentional decisions about what to cultivate
          next.
        </p>
        <p className="font-medium">
          Principles are permanent. Manifestations are not.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Framework Documentation in Progress
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Manifestation directory is being developed under constitutional
          governance. Content will be published here as each Manifestation
          receives formal approval.
        </p>
        <nav aria-label="Explore frameworks" className="mt-4 flex gap-6">
          <a
            href="/the-circle"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            The Circle →
          </a>
          <a
            href="/the-mirror"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            The Mirror →
          </a>
        </nav>
      </section>
    </ContentPage>
  );
}
