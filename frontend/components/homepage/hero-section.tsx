'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CountdownTimer } from './countdown-timer';
import { useTranslations } from '@/lib/i18n';

export function HeroSection() {
  const t = useTranslations();

  return (
    <div className="relative overflow-hidden bg-[#00101a]">
      {/* Shared key visual background spanning both sections */}
      <Image
        src="/key-visual.png"
        alt=""
        fill
        priority
        className="object-cover object-right"
        sizes="100vw"
      />

      {/* Single gradient overlay matching Figma — dark at bottom, transparent at top */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(12deg, #00101A 23.7%, rgba(0, 18, 29, 0.46) 38.34%, rgba(0, 19, 32, 0) 48.92%)' }}
      />

      {/* ── First fold: two-column layout ── */}
      <section className="relative z-10 pt-[72px]">

        {/* Content — left-aligned */}
        <div className="relative z-10 flex flex-col gap-6 px-10 md:px-20 py-16">
          {/* ROOT FURTHER heading image */}
          <div className="relative w-full max-w-[400px] h-[200px]">
            <Image
              src="/root-further-hero.png"
              alt="ROOT FURTHER"
              fill
              priority
              className="object-contain object-left"
              sizes="400px"
            />
          </div>

          {/* Coming soon + countdown */}
          <div className="flex flex-col gap-3">
            <p className="text-[14px] font-bold font-[family-name:var(--font-montserrat)] text-white uppercase tracking-widest">
              {t.comingSoon}
            </p>
            <CountdownTimer />
          </div>

          {/* Event info */}
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-[family-name:var(--font-montserrat)] text-white font-bold">
              <span className="text-white font-bold">{t.timeLabel} </span>
              <span className="font-bold text-saa-gold">26/12/2025</span>
              <span className="text-white ml-6 font-bold">{t.venueLabel} </span>
              <span className="font-bold text-saa-gold">Âu cơ Art Center</span>
            </p>
            <p className="text-[13px] font-[family-name:var(--font-montserrat)] text-white font-bold">
              {t.broadcastNote}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/awards"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-lg bg-saa-gold text-[#0a1628] text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:brightness-110 transition-all"
            >
              {t.aboutAwards}
              <Image src="/icons/icon-arrow-up-right.svg" alt="" width={16} height={16} style={{ width: 16, height: 16 }} className="invert" />
            </Link>
            <Link
              href="/kudos"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-[#998C5F] bg-[rgba(255,234,158,0.10)] text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:bg-[rgba(255,234,158,0.20)] transition-all"
            >
              {t.aboutKudos}
              <Image src="/icons/icon-arrow-up-right.svg" alt="" width={16} height={16} style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── B4: ROOT FURTHER description section ── */}
      <section className="relative z-10 py-24">
        <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-4xl mx-auto">
          {/* ROOT FURTHER logo centered */}
          <div className="relative w-[280px] h-[120px]">
            <Image
              src="/root-further-logo.png"
              alt="ROOT FURTHER"
              fill
              className="object-contain"
              sizes="280px"
            />
          </div>

          {/* Description paragraphs */}
          <div className="flex flex-col gap-4 text-justify font-[family-name:var(--font-montserrat)] text-white/90 text-[15px] leading-7 font-bold">
            <p>{t.b4p1}</p>
            <p>{t.b4p2}</p>
            <p>{t.b4p3}</p>
            <p className="italic text-center text-saa-gold">
              {t.b4quote}<br />
              <span className="text-white/60 not-italic text-[13px]">{t.b4quoteSub}</span>
            </p>
            <p>{t.b4p4}</p>
            <p>{t.b4p5}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
