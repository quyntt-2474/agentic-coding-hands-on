'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';

export function SiteFooter() {
  const t = useTranslations();
  const pathname = usePathname();

  const footerLinks = [
    { label: t.aboutSAA, href: '/' },
    { label: t.awardsInfo, href: '/awards' },
    { label: t.sunKudos, href: '/kudos' },
    { label: t.generalStandards, href: '/community-standards' },
  ];

  return (
    <footer className="bg-black border-t border-[#2e3940] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/saa-logo.png" alt="SAA 2025" width={36} height={36} style={{ width: 36, height: 36 }} />
          <span className="text-[14px] font-bold font-[family-name:var(--font-montserrat)] text-white/80">
            SAA 2025
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {footerLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-[14px] font-bold font-[family-name:var(--font-montserrat)] px-3 py-1.5 rounded transition-colors',
                  isActive
                    ? 'bg-[#0d1b26] text-[#FFEA9E] [text-shadow:0px_0px_6px_#fae287,0px_4px_4px_rgba(0,0,0,0.25)]'
                    : 'text-white/60 hover:text-white hover:bg-white/10',
                ].join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Copyright */}
        <p className="text-[12px] font-[family-name:var(--font-montserrat)] text-white/40 shrink-0 font-bold">
          {t.copyright}
        </p>
      </div>
    </footer>
  );
}
