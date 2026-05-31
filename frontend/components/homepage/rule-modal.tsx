'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations, type Translations } from '@/lib/i18n';

const BADGES = [
  { id: 'REVIVAL',              src: '/badges/badge-revival.png',             height: 88  },
  { id: 'TOUCH OF LIGHT',       src: '/badges/badge-touch-of-light.png',      height: 104 },
  { id: 'STAY GOLD',            src: '/badges/badge-stay-gold.png',           height: 88  },
  { id: 'FLOW TO HORIZON',      src: '/badges/badge-flow-to-horizon.png',     height: 104 },
  { id: 'BEYOND THE BOUNDARY',  src: '/badges/badge-beyond-the-boundary.png', height: 104 },
  { id: 'ROOT FUTHER',          src: '/badges/badge-root-futher.png',         height: 104 },
];

// Stable hero-level identifiers; copy resolved per-language via i18n keys.
const HERO_LEVELS: {
  name: string;
  conditionKey: keyof Translations;
  descKey: keyof Translations;
}[] = [
  { name: 'New Hero',    conditionKey: 'ruleHeroNewCondition',    descKey: 'ruleHeroNewDesc'    },
  { name: 'Rising Hero', conditionKey: 'ruleHeroRisingCondition', descKey: 'ruleHeroRisingDesc' },
  { name: 'Super Hero',  conditionKey: 'ruleHeroSuperCondition',  descKey: 'ruleHeroSuperDesc'  },
  { name: 'Legend Hero', conditionKey: 'ruleHeroLegendCondition', descKey: 'ruleHeroLegendDesc' },
];

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVietKudos: () => void;
}

/** Thể lệ Kudos — slide-up panel on mobile, right-drawer on desktop */
export function RuleModal({ isOpen, onClose, onVietKudos }: RuleModalProps) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Double rAF: ensure initial hidden state is painted before transition starts
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.ruleModalTitle}
        className={`fixed z-[61] inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto flex flex-col
          transition-transform duration-300 ease-out
          ${visible
            ? 'translate-y-0 md:translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
      >
        <div className="flex flex-col bg-[#00101a] border-t border-[#2e3940] md:border-t-0 md:border-l md:w-[480px] md:h-full max-h-[88vh] md:max-h-full rounded-t-2xl md:rounded-none">

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-[#FFEA9E] text-[22px] font-bold font-[family-name:var(--font-montserrat)] leading-7">
                {t.ruleModalTitle}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.closeDialog}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* ── Section 1: NGƯỜI NHẬN KUDOS ── */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#FFEA9E] text-[22px] font-bold font-[family-name:var(--font-montserrat)] leading-7">
                {t.ruleRecipientSectionTitle}
              </h3>
              <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                {t.ruleRecipientSectionDesc}
              </p>

              {/* Hero level rows */}
              <div className="flex flex-col gap-4">
                {HERO_LEVELS.map((hero) => (
                  <div key={hero.name} className="flex flex-col gap-1">
                    {/* Row: chip + condition */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="inline-flex items-center shrink-0 px-3 h-[22px] rounded-full border border-[#FFEA9E] text-white text-[12px] font-bold font-[family-name:var(--font-montserrat)] whitespace-nowrap"
                        style={{ background: 'rgba(255,234,158,0.08)' }}
                      >
                        {hero.name}
                      </span>
                      <span className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                        {t[hero.conditionKey]}
                      </span>
                    </div>
                    {/* Description */}
                    <p className="text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] leading-5 tracking-[0.1px]">
                      {t[hero.descKey]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#2e3940]" />

            {/* ── Section 2: NGƯỜI GỬI KUDOS ── */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#FFEA9E] text-[22px] font-bold font-[family-name:var(--font-montserrat)] leading-7">
                {t.ruleSenderSectionTitle}
              </h3>
              <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                {t.ruleSenderSectionDesc}
              </p>

              {/* 6 badges — 3-column grid */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                {BADGES.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-2">
                    <div className="h-[104px] flex items-start justify-center">
                      <Image
                        src={badge.src}
                        alt={badge.id}
                        width={80}
                        height={badge.height}
                        className="w-[80px] h-auto select-none pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                {t.ruleSenderRewardNote}
              </p>

              {/* KUDOS QUỐC DÂN */}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#2e3940]">
                <h3 className="text-[#FFEA9E] text-[24px] font-bold font-[family-name:var(--font-montserrat)] leading-8">
                  {t.ruleNationalKudosTitle}
                </h3>
                <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                  {t.ruleNationalKudosDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Sticky footer — 2 action buttons */}
          <div className="shrink-0 flex gap-3 p-4 border-t border-[#2e3940] bg-[#00101a]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-white/25 text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:bg-white/5 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {t.closeDialog}
            </button>
            <button
              type="button"
              onClick={onVietKudos}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#FFEA9E] text-[#0a1628] text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:bg-[#ffe57a] transition-colors"
            >
              <Image
                src="/icons/icon-pen.svg"
                alt=""
                width={16}
                height={16}
                className="brightness-0 shrink-0"
              />
              {t.ruleWriteKudosButton}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
