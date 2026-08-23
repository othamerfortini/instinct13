import { LayoutContainer } from "@/components/ui/LayoutContainer";
import { PageTransition } from "@/components/ui/PageTransition";
import { AmbientCanvas } from "@/components/ui/AmbientCanvas";

interface ContentPageProps {
  children: React.ReactNode;
}

/**
 * Shared content-page shell.
 *
 * The content pages remain subordinate to the documented information
 * architecture while carrying the same restrained, living field established
 * by the homepage. The field is ambient only; it does not introduce new
 * conceptual content or navigation.
 */
export function ContentPage({ children }: ContentPageProps) {
  return (
    <LayoutContainer navigationVisible>
      <AmbientCanvas />
      <PageTransition>
        <div className="site-page">
          <div aria-hidden="true" className="site-field site-field-left" />
          <div aria-hidden="true" className="site-field site-field-right" />
          <div aria-hidden="true" className="site-observer" />
          <div className="site-content mx-auto max-w-4xl px-6 pb-32 pt-32 sm:px-8 sm:pt-40 md:pb-40">
            {children}
          </div>
        </div>
      </PageTransition>
    </LayoutContainer>
  );
}
