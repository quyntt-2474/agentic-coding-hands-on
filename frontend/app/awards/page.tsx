import { SiteHeader } from '@/components/homepage/site-header';
import { SiteFooter } from '@/components/homepage/site-footer';
import { AwardInfoHero } from '@/components/award-info/award-info-hero';
import { AwardInfoSection } from '@/components/award-info/award-info-section';
import { KudosSection } from '@/components/homepage/kudos-section';
import { WidgetButton } from '@/components/homepage/widget-button';

export default function AwardsPage() {
  return (
    <>
      <SiteHeader currentPath="/awards" />
      <main className="flex flex-col">
        <AwardInfoHero />
        <AwardInfoSection />
        <KudosSection />
      </main>
      <SiteFooter />
      <WidgetButton />
    </>
  );
}
