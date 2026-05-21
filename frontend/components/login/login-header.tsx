'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LanguageSelector } from './language-selector';
import { useTranslations } from '@/lib/i18n';

export function LoginHeader() {
  const t = useTranslations();

  return (
    <header
      className="absolute top-0 inset-x-0 flex items-stretch justify-between px-10 md:px-36 h-20 z-20"
      style={{ background: 'rgba(0, 0, 0, 0.45)' }}
    >
      <Link href="/login" className="flex items-center shrink-0">
        <Image src="/saa-logo.png" alt="Sun* Annual Awards 2025" width={52} height={48} priority />
      </Link>

      <nav className="flex items-stretch gap-1">
        <Link
          href="/countdown"
          className="flex items-center px-4 text-[14px] font-bold font-[family-name:var(--font-montserrat)] whitespace-nowrap tracking-[0.1px] transition-colors border-b-2 text-white/80 border-transparent hover:text-white hover:bg-white/10"
        >
          {t.countdown}
        </Link>
      </nav>

      <div className="flex items-center">
        <LanguageSelector />
      </div>
    </header>
  );
}
