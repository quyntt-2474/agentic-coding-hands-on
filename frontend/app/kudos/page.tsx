import { SiteHeader } from '@/components/homepage/site-header';
import { SiteFooter } from '@/components/homepage/site-footer';
import { WidgetButton } from '@/components/homepage/widget-button';
import { KudosHero } from '@/components/kudos/kudos-hero';
import { HighlightSection } from '@/components/kudos/highlight-section';
import { SpotlightSection } from '@/components/kudos/spotlight-section';
import { AllKudosSection } from '@/components/kudos/all-kudos-section';

export default function KudosPage() {
  return (
    <>
      <SiteHeader currentPath="/kudos" />
      <main className="flex flex-col min-h-screen bg-[var(--background)]">
        <KudosHero />

        <HighlightSection />
        <SpotlightSection />
        <AllKudosSection />
      </main>
      <SiteFooter />
      <WidgetButton />
    </>
  );
}
