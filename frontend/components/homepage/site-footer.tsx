'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

export function SiteFooter() {
  const t = useTranslations();

  const footerLinks = [
    { label: t.aboutSAA, href: '/' },
    { label: t.awardsInfo, href: '/awards' },
    { label: t.sunKudos, href: '/kudos' },
    { label: t.generalStandards, href: '/general-standards' },
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
        <nav className="flex flex-wrap items-center justify-center gap-2 font-bold">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-[family-name:var(--font-montserrat)] text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[12px] font-[family-name:var(--font-montserrat)] text-white/40 shrink-0 font-bold">
          {t.copyright}
        </p>
      </div>
    </footer>
  );
}
