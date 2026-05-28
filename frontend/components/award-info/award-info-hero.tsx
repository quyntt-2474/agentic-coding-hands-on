'use client';

import Image from 'next/image';
import { useTranslations } from '@/lib/i18n';

export function AwardInfoHero() {
  const t = useTranslations();
  return (
    <div className="relative bg-[#00101a] overflow-hidden pt-[72px]">
      {/* Keyvisual background */}
      <div className="absolute inset-0 top-[72px] h-[547px]">
        <Image
          src="/key-visual.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay — dark at bottom, fade up — per Figma Cover node */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(0deg, #00101a -4.23%, rgba(0,19,32,0) 52.79%)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-20 xl:px-36 pt-16 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-16 xl:gap-[120px]">
          {/* Root Further logo — left aligned */}
          <div className="relative w-[240px] xl:w-[338px] h-[107px] xl:h-[150px]">
            <Image
              src="/root-further-hero.png"
              alt="ROOT FURTHER"
              fill
              priority
              className="object-contain object-left"
              sizes="338px"
            />
          </div>

          {/* Title section */}
          <div className="flex flex-col gap-4 items-center text-center">
            <p className="text-[20px] md:text-[24px] font-bold font-[family-name:var(--font-montserrat)] text-white w-full">
              Sun* Annual Awards 2025
            </p>
            <h1 className="text-[32px] md:text-[48px] xl:text-[57px] font-bold font-[family-name:var(--font-montserrat)] text-[#FFEA9E] leading-tight xl:leading-[64px] tracking-[-0.25px]">
              {t.awardInfoPageTitle}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
