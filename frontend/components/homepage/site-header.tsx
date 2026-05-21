'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LanguageSelector } from '@/components/login/language-selector';

const navItems = [
  { label: 'About SAA 2025', href: '/' },
  { label: 'Awards Information', href: '/awards' },
  { label: 'Sun* Kudos', href: '/kudos' },
];

function HeaderInner({ currentPath }: { currentPath: string }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('auth_token'));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-stretch px-10 h-[72px] gap-8 bg-[rgba(16,20,23,0.8)] backdrop-blur-md border-b border-[#2e3940]">
      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0">
        <Image src="/saa-logo.png" alt="SAA 2025" width={40} height={40} style={{ width: 40, height: 40 }} />
      </Link>

      {/* Nav — horizontally scrollable on small screens to prevent layout break */}
      <nav className="flex items-stretch gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center px-4 text-[14px] font-bold font-[family-name:var(--font-montserrat)] whitespace-nowrap shrink-0 tracking-[0.1px] transition-colors border-b-2',
                isActive
                  ? 'text-[#FFEA9E] border-[#FFEA9E] [text-shadow:0px_0px_6px_#fae287,0px_4px_4px_rgba(0,0,0,0.25)]'
                  : 'text-white/80 border-transparent hover:text-white hover:bg-white/10',
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right actions: notification → language → user (Figma order) */}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        {isAuth && (
          <button type="button" aria-label="Notifications" className="p-2 text-white/80 hover:text-white">
            <Image src="/icons/icon-notification.svg" alt="" width={24} height={24} />
          </button>
        )}
        <LanguageSelector />
        {isAuth && (
          <button
            type="button"
            aria-label="User profile"
            className="border border-[#998C5F] rounded p-2 text-white/80 hover:text-white"
          >
            <Image src="/icons/icon-user.svg" alt="" width={20} height={20} className="rounded-full" />
          </button>
        )}
      </div>
    </header>
  );
}

export function SiteHeader({ currentPath = '/' }: { currentPath?: string }) {
  return <HeaderInner currentPath={currentPath} />;
}
