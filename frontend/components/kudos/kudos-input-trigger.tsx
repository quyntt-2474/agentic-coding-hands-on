'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { UserSearchResult } from '@/lib/types/kudos';
import { WriteKudosModal } from './write-kudos-modal';

/** Debounce delay for Sunner search input */
const SEARCH_DEBOUNCE_MS = 300;

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
 *  [✏ Write trigger]  [🔍 Search Sunner → expands to live search]
 *  Selecting a Sunner opens the Write Kudos modal with that recipient pre-filled.
 */
export function KudosInputTrigger() {
  const t = useTranslations();
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [presetRecipient, setPresetRecipient] = useState<UserSearchResult | null>(null);

  // Sunner search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  // Debounced fetch — empty query lists all users; query filters them.
  useEffect(() => {
    if (!searchOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const term = searchQuery.trim();
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await apiFetch<UserSearchResult[]>(
          term ? `/users?search=${encodeURIComponent(term)}` : '/users',
        );
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchOpen]);

  const openSearch = () => {
    setSearchOpen(true);
    // Focus once the input has mounted
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const handleSelectSunner = (user: UserSearchResult) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setPresetRecipient(user);
    setShowWriteModal(true);
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

        {/* Right: search Sunner — collapsed = button, expanded = live search */}
        <div ref={searchContainerRef} className="relative sm:w-[380px] shrink-0">
          {searchOpen ? (
            <div
              className="flex items-center gap-4 px-4 py-6 rounded-full border border-[#FFEA9E]/80
                         bg-[rgba(255,234,158,0.10)]"
            >
              <SearchIcon className="w-6 h-6 shrink-0 text-white" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                placeholder={t.kudosSearchPlaceholder}
                className="flex-1 bg-transparent outline-none text-[16px] font-bold
                           font-[family-name:var(--font-montserrat)] text-white
                           placeholder:text-white/40 tracking-[0.15px] min-w-0"
              />
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              aria-label={t.kudosSearchPlaceholder}
              onClick={openSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openSearch();
              }}
              className="flex items-center gap-4 px-4 py-6 rounded-full border border-[#998C5F]
                         bg-[rgba(255,234,158,0.10)] cursor-pointer hover:border-[#FFEA9E]/80 transition-colors"
            >
              <SearchIcon className="w-6 h-6 shrink-0 text-white" />
              <span className="text-[16px] font-bold font-[family-name:var(--font-montserrat)] text-white tracking-[0.15px] select-none truncate">
                {t.kudosSearchPlaceholder}
              </span>
            </div>
          )}

          {/* Dropdown */}
          {searchOpen && (
            <div
              className="absolute z-20 top-full left-0 right-0 mt-2 rounded-2xl border border-[#998C5F]/60
                         bg-[#1A1410] shadow-2xl max-h-72 overflow-y-auto"
            >
              {searchLoading && (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
                </div>
              )}
              {!searchLoading && searchResults.length === 0 && (
                <p className="text-xs text-white/40 text-center py-4">{t.kudosSearchEmpty}</p>
              )}
              {!searchLoading && searchResults.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => handleSelectSunner(user)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5
                             transition-colors text-left"
                >
                  <SunnerAvatar user={user} size={36} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">{user.name}</span>
                    {user.department && (
                      <span className="text-xs text-white/50 truncate">{user.department}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write Kudos modal — mounted on demand */}
      {showWriteModal && (
        <WriteKudosModal
          initialRecipient={presetRecipient}
          onClose={() => {
            setShowWriteModal(false);
            setPresetRecipient(null);
          }}
          onSuccess={() => {
            // Notify highlight + feed sections to refetch
            window.dispatchEvent(new CustomEvent('kudos:created'));
          }}
        />
      )}
    </div>
  );
}

function SunnerAvatar({ user, size }: { user: UserSearchResult; size: number }) {
  if (user.picture) {
    return (
      <Image
        src={user.picture}
        alt={user.name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-[#FFEA9E] flex items-center justify-center
                 text-[#00101A] font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}
