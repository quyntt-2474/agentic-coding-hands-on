'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { KudosToast } from './kudos-toast';
import { WriteKudosModal } from './write-kudos-modal';

/** Inline SVG search icon — no extra asset file needed */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <circle cx="8.5" cy="8.5" r="5.5" />
      <line x1="12.5" y1="12.5" x2="17" y2="17" strokeLinecap="round" />
    </svg>
  );
}

/** Two-part action bar matching Figma layout:
 *  [✏ Write trigger]  [🔍 Search Sunner]
 */
export function KudosInputTrigger() {
  const t = useTranslations();
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showSearchToast, setShowSearchToast] = useState(false);

  const triggerSearchToast = () => {
    setShowSearchToast(true);
    setTimeout(() => setShowSearchToast(false), 3000);
  };

  return (
    <div className="w-full px-6 md:px-10 pb-8">
      {/* Container matches hero max-width — gap-8 matches 32px Figma spec */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8 w-full max-w-6xl mx-auto">

        {/* Left: write kudos trigger — 72px tall, gold-tint bg, golden border */}
        <div
          role="button"
          tabIndex={0}
          aria-label={t.kudosInputPlaceholder}
          onClick={() => setShowWriteModal(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setShowWriteModal(true);
          }}
          className="flex-1 flex items-center gap-4 px-4 py-6 rounded-full border border-[#998C5F]
                     bg-[rgba(255,234,158,0.10)] cursor-pointer hover:border-[#FFEA9E]/80 transition-colors min-w-0"
        >
          <Image
            src="/icons/icon-pen.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
          <span className="text-[16px] font-bold font-[family-name:var(--font-montserrat)] text-white tracking-[0.15px] select-none truncate">
            {t.kudosInputPlaceholder}
          </span>
        </div>

        {/* Right: search Sunner — fixed width ~381px, same style */}
        <div
          role="button"
          tabIndex={0}
          aria-label={t.kudosSearchPlaceholder}
          onClick={triggerSearchToast}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') triggerSearchToast();
          }}
          className="flex items-center gap-4 px-4 py-6 rounded-full border border-[#998C5F]
                     bg-[rgba(255,234,158,0.10)] cursor-pointer hover:border-[#FFEA9E]/80 transition-colors
                     sm:w-[380px] shrink-0"
        >
          <SearchIcon className="w-6 h-6 shrink-0 text-white" />
          <span className="text-[16px] font-bold font-[family-name:var(--font-montserrat)] text-white tracking-[0.15px] select-none truncate">
            {t.kudosSearchPlaceholder}
          </span>
        </div>
      </div>

      <KudosToast message={t.kudosComingSoon} visible={showSearchToast} />

      {/* Write Kudos modal — mounted on demand */}
      {showWriteModal && (
        <WriteKudosModal
          onClose={() => setShowWriteModal(false)}
          onSuccess={() => {
            // Parent page can listen for a page-level refresh if needed;
            // for now just close — the feed will refresh on next load.
          }}
        />
      )}
    </div>
  );
}
