'use client';

import { AwardCard } from './award-card';
import { useTranslations } from '@/lib/i18n';

export function AwardsSection() {
  const t = useTranslations();

  const awards = [
    { slug: 'top-talent', title: t.topTalentTitle, description: t.topTalentDesc, nameImage: '/awards/award-top-talent.png' },
    { slug: 'top-project', title: t.topProjectTitle, description: t.topProjectDesc, nameImage: '/awards/award-top-project.png' },
    { slug: 'top-project-leader', title: t.topProjectLeaderTitle, description: t.topProjectLeaderDesc, nameImage: '/awards/award-top-project-leader.png' },
    { slug: 'best-manager', title: t.bestManagerTitle, description: t.bestManagerDesc, nameImage: '/awards/award-best-manager.png' },
    { slug: 'signature-creator', title: t.signatureCreatorTitle, description: t.signatureCreatorDesc, nameImage: '/awards/award-signature-creator.png' },
    { slug: 'mvp', title: t.mvpTitle, description: t.mvpDesc, nameImage: '/awards/award-mvp.png' },
  ];

  return (
    <section className="bg-black py-20 w-full">
      <div className="px-6 md:px-20 max-w-7xl mx-auto">
        {/* C1 Section header */}
        <div className="flex flex-col gap-2 mb-14">
          <p className="text-[13px] font-bold font-[family-name:var(--font-montserrat)] text-white/50 uppercase tracking-widest">
            {t.awardsSubtitle}
          </p>
          <h2 className="text-[57px] font-bold font-[family-name:var(--font-montserrat)] text-saa-gold leading-[64px]">
            {t.awardsTitle}
          </h2>
        </div>

        {/* C2 Awards grid: 3 cols desktop, 2 cols mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {awards.map((award) => (
            <AwardCard key={award.slug} {...award} />
          ))}
        </div>
      </div>
    </section>
  );
}
