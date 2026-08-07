import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";
import {
  Section,
  SectionHeading,
  BodyText,
  PremiumLink,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Manifesto — Instinct 13",
  description:
    "The official Instinct 13 Manifesto. Why Instinct 13 exists and what it is not.",
};

export default function ManifestoPage() {
  return (
    <ContentPage>
      <h1 className="mb-12 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Manifesto
      </h1>

      <div className="space-y-10">
        <Section>
          <SectionHeading>Why Instinct 13 Exists</SectionHeading>
          <BodyText>
            Most frameworks for understanding human behavior end in
            classification. You answer a set of questions and receive a type, a
            label, a box. The box is meant to explain you. It often constrains
            you instead.
          </BodyText>
          <BodyText>
            Instinct 13 exists because people deserve something different: a way
            to observe what is actually happening within them, understand why it
            may be emerging, and consciously decide what they want to cultivate
            next.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>What Instinct 13 Is Not</SectionHeading>
          <ul className="list-none space-y-2 text-neutral-400">
            <li>— It is not a personality test.</li>
            <li>— It is not a brand built around types.</li>
            <li>— It is not a system that tells you who you are.</li>
            <li>— It is not certainty dressed as insight.</li>
          </ul>
        </Section>

        <Section>
          <SectionHeading>Organizational Identity</SectionHeading>
          <BodyText>
            Instinct 13 is building an operating system for understanding human
            behavior.
          </BodyText>
          <BodyText>
            We do not exist to classify people. We exist to create frameworks
            that help people observe what is manifesting, understand why it may
            be emerging, and consciously decide what they want to cultivate
            next.
          </BodyText>
          <BodyText>
            Our goal is not certainty. Our goal is greater awareness, better
            decisions, and intentional development.
          </BodyText>
          <p className="font-medium text-neutral-200">
            Principles are permanent. Manifestations are not.
          </p>
        </Section>

        <Section>
          <SectionHeading>Explore the Frameworks</SectionHeading>
          <BodyText>
            The Circle and The Mirror are the first frameworks through which
            Instinct 13 creates conditions for observation, reflection, and
            intentional cultivation.
          </BodyText>
          <nav aria-label="Framework links" className="mt-4 flex gap-6">
            <PremiumLink href="/the-circle">The Circle →</PremiumLink>
            <PremiumLink href="/the-mirror">The Mirror →</PremiumLink>
          </nav>
        </Section>
      </div>
    </ContentPage>
  );
}
