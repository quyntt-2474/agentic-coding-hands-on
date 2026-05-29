'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JwtUser } from '@/lib/jwt';
import { useTranslations } from '@/lib/i18n';
import { KudosToast } from '@/components/kudos/kudos-toast';

interface UserProfileDropdownProps {
  user: JwtUser | null;
}

const FALLBACK_AVATAR = '/icons/icon-user.svg';

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
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

  const handleProfile = () => {
    setOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setOpen(false);
    router.replace('/login');
  };

  const picture = user?.picture;
  const hasGoogleAvatar = Boolean(picture);
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'User profile';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={displayName}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded p-2 text-white/80 hover:text-white"
      >
        <span className="block w-8 h-8 relative overflow-hidden rounded-full">
          <Image
            src={picture ?? FALLBACK_AVATAR}
            alt=""
            fill
            sizes="20px"
            unoptimized={hasGoogleAvatar}
            className="object-cover"
          />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-50 w-[160px] p-2 rounded-2xl bg-[#0c1419] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)] flex flex-col gap-1"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleProfile}
            className="group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors [text-shadow:0_0_6px_rgba(255,234,158,0.55)]"
          >
            <span>Profile</span>
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="5.5" r="2.5" />
              <path d="M3 13.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
            </svg>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/[0.08] transition-colors"
          >
            <span>Logout</span>
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6,3 11,8 6,13" />
            </svg>
          </button>
        </div>
      )}

      <KudosToast message={t.kudosComingSoon} visible={showToast} />
    </div>
  );
}
