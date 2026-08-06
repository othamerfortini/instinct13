import { LayoutContainer } from "@/components/ui";

interface ContentPageProps {
  children: React.ReactNode;
}

export function ContentPage({ children }: ContentPageProps) {
  return (
    <LayoutContainer navigationVisible>
      <div className="mx-auto max-w-2xl px-6 py-24 sm:px-8 md:py-32">
        {children}
      </div>
    </LayoutContainer>
  );
}
