'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/lib/i18n';
import { AwardInfoNav } from './award-info-nav';
import { AwardInfoCard } from './award-info-card';

type DescKey =
  | 'topTalentDesc'
  | 'topProjectDesc'
  | 'topProjectLeaderDesc'
  | 'bestManagerDesc'
  | 'signatureCreatorDesc'
  | 'mvpDesc';

type UnitKey = 'awardUnitTapThe' | 'awardUnitCaNhan' | 'awardUnitCaNhanHoacTapThe';
type PerAwardKey = 'perAward' | 'perAwardCaNhan' | 'perAwardTapThe';

const AWARDS: {
  id: string;
  title: string;
  descKey: DescKey;
  image: string;
  count: string;
  unitKey: UnitKey | null;
  value: string;
  perAwardKey: PerAwardKey | null;
  secondValue?: string;
  secondPerAwardKey?: PerAwardKey;
  reverse: boolean;
}[] = [
  {
    id: 'top-talent',
    title: 'Top Talent',
    descKey: 'topTalentDesc',
    image: '/awards/award-top-talent.png',
    count: '10',
    unitKey: 'awardUnitCaNhan',
    value: '7.000.000 VNĐ',
    perAwardKey: 'perAward',
    reverse: false,
  },
  {
    id: 'top-project',
    title: 'Top Project',
    descKey: 'topProjectDesc',
    image: '/awards/award-top-project.png',
    count: '02',
    unitKey: 'awardUnitTapThe',
    value: '15.000.000 VNĐ',
    perAwardKey: 'perAward',
    reverse: true,
  },
  {
    id: 'top-project-leader',
    title: 'Top Project Leader',
    descKey: 'topProjectLeaderDesc',
    image: '/awards/award-top-project-leader.png',
    count: '03',
    unitKey: 'awardUnitCaNhan',
    value: '7.000.000 VNĐ',
    perAwardKey: 'perAward',
    reverse: false,
  },
  {
    id: 'best-manager',
    title: 'Best Manager',
    descKey: 'bestManagerDesc',
    image: '/awards/award-best-manager.png',
    count: '01',
    unitKey: 'awardUnitCaNhan',
    value: '10.000.000 VNĐ',
    perAwardKey: null,
    reverse: true,
  },
  {
    id: 'signature-2025',
    title: 'Signature 2025 - Creator',
    descKey: 'signatureCreatorDesc',
    image: '/awards/award-signature-creator.png',
    count: '01',
    unitKey: 'awardUnitCaNhanHoacTapThe',
    value: '5.000.000 VNĐ',
    perAwardKey: 'perAwardCaNhan',
    secondValue: '8.000.000 VNĐ',
    secondPerAwardKey: 'perAwardTapThe',
    reverse: false,
  },
  {
    id: 'mvp',
    title: 'MVP (Most Valuable Person)',
    descKey: 'mvpDesc',
    image: '/awards/award-mvp.png',
    count: '01',
    unitKey: 'awardUnitCaNhan',
    value: '15.000.000 VNĐ',
    perAwardKey: null,
    reverse: true,
  },
];

const SCROLL_OFFSET = 100;
const MOBILE_NAV_SCROLL_OFFSET = 140; // sticky header (72px) + mobile nav bar (~68px)

export function AwardInfoSection() {
  const t = useTranslations();
  const [activeId, setActiveId] = useState(AWARDS[0].id);
  const rafRef = useRef<number | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Scroll tracking — update activeId based on which award card is in view
  useEffect(() => {
    const updateActive = () => {
      let currentId = AWARDS[0].id;
      for (const { id } of AWARDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= SCROLL_OFFSET) currentId = id;
      }
      setActiveId(currentId);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateActive);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActive();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Auto-scroll active mobile nav tab into center view
  useEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector(`[data-id="${activeId}"]`) as HTMLElement | null;
    activeBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeId]);

  const handleMobileNavClick = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - MOBILE_NAV_SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#00101a] w-full">
      {/* Mobile horizontal sticky nav — hidden on md+ */}
      <div className="md:hidden sticky top-[72px] z-20 bg-[#00101a]/95 backdrop-blur-md border-b border-[#2e3940]">
        <div ref={mobileNavRef} className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {AWARDS.map((award) => {
            const isActive = activeId === award.id;
            // Shorten "MVP (Most Valuable Person)" → "MVP" for compact display
            const shortLabel = award.title.replace(' (Most Valuable Person)', '');
            return (
              <button
                key={award.id}
                data-id={award.id}
                type="button"
                onClick={() => handleMobileNavClick(award.id)}
                className={[
                  'flex items-center gap-1.5 px-3 py-4 text-[12px] font-bold font-[family-name:var(--font-montserrat)]',
                  'whitespace-nowrap transition-all duration-200 border-b-2 shrink-0',
                  isActive
                    ? 'border-[#FFEA9E] text-[#FFEA9E] [text-shadow:0px_0px_6px_#fae287]'
                    : 'border-transparent text-white/60',
                ].join(' ')}
              >
                <Image
                  src="/icons/icon-target.svg"
                  alt=""
                  width={14}
                  height={14}
                  className={`shrink-0 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                />
                {shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="py-20 px-6 md:px-20 xl:px-36 max-w-[1440px] mx-auto">
        <div className="flex gap-8 xl:gap-12">
          {/* Left: sticky desktop nav — hidden on mobile */}
          {/* aside must stretch (no items-start) so sticky has room to scroll within it */}
          <aside className="hidden md:block shrink-0 w-[200px] xl:w-[220px] self-stretch">
            <div className="sticky top-[100px]">
              <AwardInfoNav activeId={activeId} onSelect={setActiveId} />
            </div>
          </aside>

          {/* Right: award cards */}
          <div className="flex-1 min-w-0">
            {AWARDS.map((award) => (
              <AwardInfoCard
                key={award.id}
                id={award.id}
                title={award.title}
                description={t[award.descKey]}
                imageUrl={award.image}
                count={award.count}
                unit={award.unitKey ? t[award.unitKey] : undefined}
                value={award.value}
                countLabel={t.awardCountLabel}
                valueLabel={t.awardValueLabel}
                perAward={award.perAwardKey ? t[award.perAwardKey] : undefined}
                secondValue={award.secondValue}
                secondPerAward={award.secondPerAwardKey ? t[award.secondPerAwardKey] : undefined}
                hoac={t.hoac}
                reverse={award.reverse}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
