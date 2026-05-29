'use client';

import { useTranslations } from '@/lib/i18n';

interface SpotlightSearchProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * Search input shown over the Spotlight word cloud. Visual style matches the
 * "Tìm kiếm Sunner" pill in the home action bar (golden border, translucent
 * gold fill, bold Montserrat white text) — only padding is tightened so it
 * fits inside the smaller header strip of the board.
 */
export function SpotlightSearch({ value, onChange }: SpotlightSearchProps) {
  const t = useTranslations();
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-[#998C5F]
                 bg-[rgba(255,234,158,0.10)] focus-within:border-[#FFEA9E]/80
                 hover:border-[#FFEA9E]/80 transition-colors"
    >
      <SearchIcon className="w-5 h-5 shrink-0 text-white" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('');
        }}
        placeholder={t.spotlightSearch}
        maxLength={100}
        className="flex-1 bg-transparent outline-none text-[14px]
                   font-[family-name:var(--font-montserrat)] text-white
                   placeholder:text-white/40 tracking-[0.15px] min-w-0"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="shrink-0 text-white/50 hover:text-white text-xs leading-none"
          aria-label="Clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}

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
