import { LayoutContainer } from "@/components/ui/LayoutContainer";
import { PageTransition } from "@/components/ui/PageTransition";

interface ContentPageProps {
  children: React.ReactNode;
}

export function ContentPage({ children }: ContentPageProps) {
  return (
    <LayoutContainer navigationVisible>
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
