'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/lib/i18n';

export function NotificationPanel() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t.notificationTitle}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={[
          'group p-2 rounded transition-all duration-200',
          open
            ? '[filter:drop-shadow(0_0_6px_#fae287)_drop-shadow(0_0_12px_rgba(250,226,135,0.6))]'
            : 'hover:[filter:drop-shadow(0_0_6px_#fae287)_drop-shadow(0_0_12px_rgba(250,226,135,0.6))]',
        ].join(' ')}
      >
        <Image
          src="/icons/icon-notification.svg"
          alt=""
          width={24}
          height={24}
          className={[
            'transition-[filter] duration-200',
            open
              ? '[filter:brightness(0)_saturate(100%)_invert(91%)_sepia(38%)_saturate(427%)_hue-rotate(338deg)_brightness(102%)_contrast(101%)]'
              : 'group-hover:[filter:brightness(0)_saturate(100%)_invert(91%)_sepia(38%)_saturate(427%)_hue-rotate(338deg)_brightness(102%)_contrast(101%)]',
          ].join(' ')}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t.notificationTitle}
          className="absolute right-0 top-full mt-2 z-50 w-[320px] rounded-2xl border border-white/10 bg-[#0c1419] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <header className="px-5 py-4 border-b border-white/10">
            <h2 className="text-base font-bold text-white">{t.notificationTitle}</h2>
          </header>
          <div className="px-5 py-10 flex items-center justify-center min-h-[140px]">
            <p className="text-sm text-white/50">{t.notificationEmpty}</p>
          </div>
        </div>
      )}
    </div>
  );
}
