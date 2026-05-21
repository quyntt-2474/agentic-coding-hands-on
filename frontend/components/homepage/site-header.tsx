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
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center px-10 h-[72px] gap-10 bg-[#0a1628]/90 backdrop-blur-md border-b border-[#2e3940]">
      <Link href="/" className="flex items-center shrink-0">
        <Image src="/saa-logo.png" alt="SAA 2025" width={40} height={40} style={{ width: 40, height: 40 }} />
      </Link>

      <nav className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'text-[14px] font-bold font-[family-name:var(--font-montserrat)] px-3 py-1.5 rounded transition-colors',
                isActive
                  ? 'text-saa-gold underline underline-offset-16'
                  : 'text-white/80 hover:text-white hover:bg-white/10',
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <LanguageSelector />
        {isAuth && (
          <>
            <button type="button" aria-label="Notifications" className="text-white/80 hover:text-white">
              <Image src="/icons/icon-notification.svg" alt="" width={24} height={24} />
            </button>
            <button type="button" aria-label="User profile" className="text-white/80 hover:text-white">
              <Image src="/icons/icon-user.svg" alt="" width={32} height={32} className="rounded-full" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export function SiteHeader({ currentPath = '/' }: { currentPath?: string }) {
  return <HeaderInner currentPath={currentPath} />;
}
