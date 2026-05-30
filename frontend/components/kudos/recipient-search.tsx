'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { UserSearchResult } from '@/lib/types/kudos';

interface RecipientSearchProps {
  value: UserSearchResult | null;
  onChange: (user: UserSearchResult | null) => void;
  placeholder: string;
  hasError?: boolean;
}

/** Debounce delay in ms */
const DEBOUNCE_MS = 300;

export function RecipientSearch({
  value,
  onChange,
  placeholder,
  hasError = false,
}: RecipientSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced fetch — runs while the dropdown is open.
  // Empty query loads all users; a query filters them.
  useEffect(() => {
    if (!open) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const term = query.trim();
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiFetch<UserSearchResult[]>(
          term ? `/users?search=${encodeURIComponent(term)}` : '/users'
        );
        setResults(data);
      } catch {
        // API not ready yet — show empty list gracefully
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, open]);

  const handleSelect = (user: UserSearchResult) => {
    onChange(user);
    setQuery('');
    setOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
  };

  const borderColor = hasError ? 'border-red-500' : 'border-[#998C5F]';

  return (
    <div ref={containerRef} className="relative">
      {/* Input row — shows selected chip or search field */}
      <div
        className={`flex items-center gap-2 px-3 h-14 rounded-lg border ${borderColor}
                    bg-white transition-colors focus-within:border-[#00101A]`}
      >
        {value ? (
          /* Selected user chip */
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar user={value} size={28} />
            <span className="text-sm text-[#00101A] truncate">{value.name}</span>
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto shrink-0 w-5 h-5 flex items-center justify-center rounded-full
                         text-[#00101A]/40 hover:text-[#00101A] hover:bg-black/5 transition-colors text-xs"
              aria-label="Clear recipient"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-[#00101A] placeholder:text-[#00101A]/40
                         outline-none min-w-0"
            />
            {/* Dropdown arrow */}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-4 h-4 shrink-0 text-[#00101A]/40"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </>
        )}
      </div>

      {/* Dropdown list */}
      {open && (
        <div
          className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-[#998C5F]/40
                     bg-white shadow-xl max-h-52 overflow-y-auto"
        >
          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 rounded-full border-2 border-[#998C5F]/30 border-t-[#998C5F] animate-spin" />
            </div>
          )}
          {!loading && results.length === 0 && (
            <p className="text-xs text-[#00101A]/40 text-center py-4">Không tìm thấy kết quả</p>
          )}
          {!loading && results.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => handleSelect(user)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5
                         transition-colors text-left"
            >
              <Avatar user={user} size={32} />
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-[#00101A] truncate">{user.name}</span>
                {user.department && (
                  <span className="text-xs text-[#00101A]/40 truncate">{user.department}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Avatar({ user, size }: { user: UserSearchResult; size: number }) {
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
