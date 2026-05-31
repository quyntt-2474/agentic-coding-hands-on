'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { KudosToast } from '@/components/kudos/kudos-toast';

const SECRET_BOX_THRESHOLD = 5;

interface ProfileStatsBoxProps {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
}

/**
 * Section B — stats box mirroring SidebarStats layout.
 * Box opened/unopened are hardcoded to 0 (no Secret Box backend).
 * "Mở Secret Box" button keeps the existing coming-soon toast behavior.
 */
export function ProfileStatsBox({
  kudosReceived,
  kudosSent,
  heartsReceived,
}: ProfileStatsBoxProps) {
  const t = useTranslations();
  const [showToast, setShowToast] = useState(false);

  const canOpenBox = kudosReceived >= SECRET_BOX_THRESHOLD;

  const handleOpenGift = () => {
    if (!canOpenBox) return;
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const kudosRows = [
    { label: t.kudosReceived, value: kudosReceived },
    { label: t.kudosSent, value: kudosSent },
    { label: t.heartsReceived, value: heartsReceived, doubled: true },
  ];

  const boxRows = [
    { label: t.profileSecretBoxOpened, value: 0 },
    { label: t.profileSecretBoxUnopened, value: 0 },
  ];

  return (
    <div
      className="mx-4 rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      {kudosRows.map((row) => (
        <StatRow key={row.label} label={row.label} value={row.value} doubled={row.doubled} />
      ))}

      <hr className="border-white/10" />

      {boxRows.map((row) => (
        <StatRow key={row.label} label={row.label} value={row.value} />
      ))}

      {/* Gold "Mở Secret Box" button — same style as SidebarStats */}
      <div className="relative group">
        <button
          onClick={handleOpenGift}
          disabled={!canOpenBox}
          aria-disabled={!canOpenBox}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg
                     bg-[#FFEA9E] text-[#0a1628] text-base font-bold transition-all
                     ${canOpenBox
                       ? 'hover:bg-[#ffe570] active:scale-[0.98]'
                       : 'opacity-50 cursor-not-allowed hover:bg-[#FFEA9E]'}`}
        >
          {t.openGiftButton}
          <svg
            width="18"
            height="18"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 9.86935L17.26 8.27935C17.5 8.06935 17.73 7.79935 17.9 7.49935C18.73 6.06935 18.24 4.22935 16.8 3.39935C15.94 2.89935 14.93 2.89935 14.08 3.25935L14.09 3.24935L13.21 3.63935L13.1 2.67935L13.09 2.68935C13 1.77935 12.47 0.899353 11.61 0.399353C10.17 -0.425647 8.34 0.0693532 7.5 1.49935C7.33 1.79935 7.22 2.12935 7.16 2.44935L4.41 0.869353C3.45 0.319353 2.23 0.639353 1.68 1.59935L0.18 4.19935C-0.0999999 4.67935 0.07 5.28935 0.55 5.55935L2.28 6.55935L6.5 8.99935H0V18.9994C0 20.1094 0.9 20.9994 2 20.9994H18C19.11 20.9994 20 20.1094 20 18.9994V13.8694L20.73 12.5994C21.28 11.6394 20.96 10.4194 20 9.86935ZM14.44 5.49935C14.71 4.99935 15.33 4.85935 15.8 5.12935C16.28 5.40935 16.45 5.99935 16.17 6.49935C15.89 6.99935 15.28 7.13935 14.8 6.86935C14.33 6.58935 14.16 5.99935 14.44 5.49935ZM12.07 7.59935L19 11.5994L18 13.3294L11.07 9.32935L12.07 7.59935ZM9 18.9994H2V10.9994H9V18.9994ZM9.34 8.32935L2.41 4.32935L3.41 2.59935L10.34 6.59935L9.34 8.32935ZM9.61 3.86935C9.13 3.58935 8.97 2.99935 9.24 2.49935C9.5 1.99935 10.13 1.85935 10.61 2.12935C11.09 2.40935 11.25 2.99935 10.97 3.49935C10.7 3.99935 10.09 4.13935 9.61 3.86935ZM11 18.9994V11.5994L18 15.6394V18.9994H11Z"
              fill="#00101A"
            />
          </svg>
        </button>

        {!canOpenBox && (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full
                       whitespace-nowrap rounded-md bg-[#00101A] px-3 py-1.5 text-xs text-white
                       shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            {t.secretBoxLockedHint}
          </span>
        )}
      </div>

      <KudosToast message={t.kudosComingSoon} visible={showToast} />
    </div>
  );
}

function StatRow({
  label,
  value,
  doubled,
}: {
  label: string;
  value: number;
  doubled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-white font-bold text-sm">
        {label}
        {doubled && (
          <span
            className="relative inline-flex items-center justify-center text-lg leading-none"
            aria-hidden
          >
            🔥
            <span
              className="absolute -bottom-0.5 text-[8px] font-extrabold text-white"
              style={{ WebkitTextStroke: '0.5px #000' }}
            >
              x2
            </span>
          </span>
        )}
      </span>
      <span className="text-[#FFEA9E] font-bold text-2xl leading-none">{value}</span>
    </div>
  );
}
