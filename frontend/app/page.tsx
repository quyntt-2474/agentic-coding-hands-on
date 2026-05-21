import { SiteHeader } from '@/components/homepage/site-header';
import { HeroSection } from '@/components/homepage/hero-section';
import { AwardsSection } from '@/components/homepage/awards-section';
import { KudosSection } from '@/components/homepage/kudos-section';
import { SiteFooter } from '@/components/homepage/site-footer';
import { WidgetButton } from '@/components/homepage/widget-button';

export default function HomePage() {
  return (
    <>
      <SiteHeader currentPath="/" />
      <main className="flex flex-col">
        <HeroSection />
        <AwardsSection />
        <KudosSection />
      </main>
      <SiteFooter />
      <WidgetButton />
    </>
  );
}
