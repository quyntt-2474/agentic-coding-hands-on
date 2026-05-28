'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

export function KudosSection() {
  const t = useTranslations();

  return (
    <section className="py-20 bg-[#00101a]">
      <div className="relative w-[1440px] mx-auto overflow-hidden">
        {/* Background — contained to content width, not full viewport */}
        <Image
          src="/kudos-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="1440px"
        />

      <div className="relative z-10 px-6 md:px-20 xl:px-36 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left — text content */}
        <div className="flex flex-col gap-4">
          <p className="text-[13px] font-bold font-[family-name:var(--font-montserrat)] text-white/50 uppercase tracking-widest">
            {t.kudosTag}
          </p>
          <h2 className="text-[48px] font-bold font-[family-name:var(--font-montserrat)] text-white leading-tight">
            Sun* Kudos
          </h2>
          <p className="text-[15px] font-[family-name:var(--font-montserrat)] text-white/75 leading-7 max-w-lg">
            <span className="font-bold text-white/90 block mb-1">{t.kudosHighlight}</span>
            {t.kudosDesc}
          </p>
          <div className="mt-2">
            <Link
              href="/kudos"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#998C5F] bg-[#FFEA9E] text-[#0a1628] text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:bg-[rgba(255,234,158,0.20)] transition-all"
            >
              {t.kudosDetails}
              <Image src="/icons/icon-arrow-up-right.svg" alt="" width={14} height={14} style={{ width: 14, height: 14 }} className="invert" />
            </Link>
          </div>
        </div>

        {/* Right — KUDOS logo */}
        <div className="flex items-center justify-center md:justify-end">
          <Image
            src="/icons/kudos-logo.svg"
            alt="Sun* Kudos"
            width={320}
            height={160}
            style={{ width: 320, height: 160 }}
            className="object-contain"
          />
        </div>
      </div>
      </div>
    </section>
  );
}
