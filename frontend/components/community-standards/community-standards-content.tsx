'use client';

import { useTranslations } from '@/lib/i18n';

export function CommunityStandardsContent() {
  const t = useTranslations();

  const spamItems = [
    t.csItem1, t.csItem2, t.csItem3, t.csItem4, t.csItem5,
    t.csItem6, t.csItem7, t.csItem8, t.csItem9, t.csItem10,
  ];

  return (
    <div className="bg-[#00101a]">
      {/* Section 1 — Community Standards */}
      <section className="px-6 md:px-20 xl:px-36 py-16 md:py-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <h2 className="text-[28px] md:text-[36px] font-bold font-[family-name:var(--font-montserrat)] text-[#FFEA9E]">
            {t.communityStandardsTitle}
          </h2>

          <p className="text-[14px] md:text-[15px] font-bold font-[family-name:var(--font-montserrat)] text-[#FFEA9E] leading-relaxed">
            {t.communityStandardsIntro}
          </p>

          <p className="text-[14px] md:text-[15px] font-[family-name:var(--font-montserrat)] text-white leading-relaxed">
            {t.communityStandardsSpamNote}
          </p>

          <ol className="flex flex-col gap-2 list-decimal list-inside">
            {spamItems.map((item, index) => (
              <li
                key={index}
                className="text-[14px] md:text-[15px] font-[family-name:var(--font-montserrat)] text-white leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#2e3940] mx-6 md:mx-20 xl:mx-36" />

      {/* Section 2 — Security Standards */}
      <section className="px-6 md:px-20 xl:px-36 py-16 md:py-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <h2 className="text-[28px] md:text-[36px] font-bold font-[family-name:var(--font-montserrat)] text-[#FFEA9E]">
            {t.securityStandardsTitle}
          </h2>

          <p className="text-[14px] md:text-[15px] font-[family-name:var(--font-montserrat)] text-white leading-relaxed">
            {t.securityStandardsIntro}
          </p>

          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 text-[14px] md:text-[15px] font-[family-name:var(--font-montserrat)] text-white leading-relaxed">
              <span className="shrink-0">•</span>
              <span>
                <span className="font-bold">{t.securityInfoLabel}</span>{' '}
                {t.securityInfoDesc}
              </span>
            </li>
            <li className="flex gap-2 text-[14px] md:text-[15px] font-[family-name:var(--font-montserrat)] text-white leading-relaxed">
              <span className="shrink-0">•</span>
              <span>
                <span className="font-bold">{t.securityScopeLabel}</span>{' '}
                {t.securityScopeDesc}
              </span>
            </li>
          </ul>

          <p className="text-[14px] md:text-[15px] font-bold font-[family-name:var(--font-montserrat)] text-[#FFEA9E] leading-relaxed">
            {t.securityContact}
          </p>
        </div>
      </section>
    </div>
  );
}
