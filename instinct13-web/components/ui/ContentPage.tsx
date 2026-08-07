import { LayoutContainer } from "@/components/ui/LayoutContainer";
import { PageTransition } from "@/components/ui/PageTransition";

interface ContentPageProps {
  children: React.ReactNode;
}

export function ContentPage({ children }: ContentPageProps) {
  return (
    <LayoutContainer navigationVisible>
      <PageTransition>
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 sm:px-8 sm:pt-36 md:pb-32">
          {children}
        </div>
      </PageTransition>
    </LayoutContainer>
  );
}
