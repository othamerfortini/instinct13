import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";
import {
  Section,
  SectionHeading,
  BodyText,
  PremiumLink,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "The Mirror — Instinct 13",
  description:
    "The Mirror is the symbol-independent framework of the Instinct 13 universe.",
};

export default function TheMirrorPage() {
  return (
    <ContentPage>
      <h1 className="mb-12 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        The Mirror
      </h1>

      <div className="space-y-10">
        <Section>
          <SectionHeading>Overview</SectionHeading>
          <BodyText>
            The Mirror is the symbol-independent framework of the Instinct 13
            universe. Where The Circle provides a symbolic vocabulary for
            observation, The Mirror operates without symbols — it observes
            relationships between Manifestations directly.
          </BodyText>
          <BodyText>
            The Mirror does not require symbolic Collections. It functions as a
            clean observational surface for whatever is present.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Relationship Observations</SectionHeading>
          <BodyText>
            The Mirror focuses on the relationships between Manifestations —
            how they interact, reinforce, or tension one another. This
            relational view reveals dynamics that symbolic frameworks alone
            cannot surface.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Symbol-Independence</SectionHeading>
          <BodyText>
            The Mirror does not depend on the symbolic Collections used by The
            Circle. It operates on a different layer of observation — one that
            remains valid regardless of which symbolic framework a person
            engages with, or none at all.
          </BodyText>
          <BodyText>
            This makes The Mirror universally applicable across the Instinct 13
            universe.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Intentional Cultivation</SectionHeading>
          <BodyText>
            The Mirror supports intentional cultivation through reflection. By
            observing how Manifestations relate to one another, a person can
            identify which dynamics to strengthen, which to examine, and which
            to consciously redirect.
          </BodyText>
          <nav aria-label="Related framework" className="mt-4">
            <PremiumLink href="/the-circle">Explore The Circle →</PremiumLink>
          </nav>
        </Section>
      </div>
    </ContentPage>
  );
}
