'use client';

import { useTranslations } from '@/lib/i18n';

interface SpotlightSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function SpotlightSearch({ value, onChange }: SpotlightSearchProps) {
  const t = useTranslations();
  return (
    <div className="relative w-full max-w-xs">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.spotlightSearch}
        maxLength={100}
        className="w-full pl-9 pr-8 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFEA9E]/40"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
          aria-label="Clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}
