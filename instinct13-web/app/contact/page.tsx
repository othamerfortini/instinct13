import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact — Instinct 13",
  description: "Contact Instinct 13 and explore the project repository.",
};

export default function ContactPage() {
  return (
    <ContentPage>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        Contact
      </h1>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Get in Touch</h2>
        <p className="leading-relaxed text-neutral-300">
          Instinct 13 is in active development. Official contact channels will
          be published here as the project advances through its validation
          phases.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Repository</h2>
        <p className="leading-relaxed text-neutral-300">
          The Instinct 13 repository is the canonical source of all approved
          documentation, constitutional architecture, and implementation work.
        </p>
        <a
          href="https://github.com/othamerfortini/instinct13"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          github.com/othamerfortini/instinct13 →
        </a>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Current Roadmap Status
        </h2>
        <p className="leading-relaxed text-neutral-300">
          <strong className="font-medium text-neutral-100">
            Architectural Baseline:
          </strong>{" "}
          v1.0
        </p>
        <p className="leading-relaxed text-neutral-300">
          <strong className="font-medium text-neutral-100">
            Current Phase:
          </strong>{" "}
          Phase II — Validation
        </p>
        <p className="leading-relaxed text-neutral-300">
          <strong className="font-medium text-neutral-100">
            Active Validation:
          </strong>{" "}
          VE-001 — Website implementation
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Documentation</h2>
        <p className="leading-relaxed text-neutral-300">
          All approved documentation is version-controlled in the repository.
          The Constitution, Canon, and approved framework documents are the
          authoritative sources for all Instinct 13 content.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Nothing is official until documented.
        </p>
      </section>
    </ContentPage>
  );
}
