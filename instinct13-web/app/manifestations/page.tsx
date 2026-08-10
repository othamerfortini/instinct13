import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";
import {
  Section,
  SectionHeading,
  BodyText,
  PremiumLink,
  ManifestationReveal,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Manifestations — Instinct 13",
  description:
    "Observe what is manifesting. Understand why it may be emerging. Decide what to cultivate next.",
};

export default function ManifestationsPage() {
  return (
    <ContentPage>
      <ManifestationReveal />

      <div className="space-y-10">
        <Section>
          <BodyText>
            A Manifestation is a pattern of behavior, thought, or energy that is
            present and active in a person at a given moment.
          </BodyText>
          <BodyText>
            Instinct 13 does not classify people by their Manifestations. It
            creates frameworks to observe them, understand why they may be
            emerging, and support intentional decisions about what to cultivate
            next.
          </BodyText>
          <p className="font-medium text-neutral-200">
            Principles are permanent. Manifestations are not.
          </p>
        </Section>

        <Section>
          <SectionHeading>Framework Documentation in Progress</SectionHeading>
          <BodyText>
            The Manifestation directory is being developed under constitutional
            governance. Content will be published here as each Manifestation
            receives formal approval.
          </BodyText>
          <nav aria-label="Explore frameworks" className="mt-4 flex gap-6">
            <PremiumLink href="/the-circle">The Circle →</PremiumLink>
            <PremiumLink href="/the-mirror">The Mirror →</PremiumLink>
          </nav>
        </Section>
      </div>
    </ContentPage>
  );
}
