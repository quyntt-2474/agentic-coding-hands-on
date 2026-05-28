import { SiteHeader } from '@/components/homepage/site-header';
import { SiteFooter } from '@/components/homepage/site-footer';
import { WidgetButton } from '@/components/homepage/widget-button';
import { CommunityStandardsHero } from '@/components/community-standards/community-standards-hero';
import { CommunityStandardsContent } from '@/components/community-standards/community-standards-content';

export default function CommunityStandardsPage() {
  return (
    <>
      <SiteHeader currentPath="/community-standards" />
      <main className="flex flex-col">
        <CommunityStandardsHero />
        <CommunityStandardsContent />
      </main>
      <SiteFooter />
      <WidgetButton />
    </>
  );
}
