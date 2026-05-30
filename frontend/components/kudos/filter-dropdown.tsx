'use client';

import { useEffect, useRef, useState } from 'react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  /** Prefix applied to displayed option labels (e.g. "#" for hashtags). Value passed to onChange stays unprefixed. */
  prefix?: string;
}

/** Chevron icon — rotates when dropdown is open */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`ml-2 w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3,5 8,11 13,5" />
    </svg>
  );
}

export function FilterDropdown({ label, options, value, onChange, prefix = '' }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayValue = value !== null ? `${prefix}${value}` : null;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = value !== null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ fontFamily: 'var(--font-montserrat)' }}
        className={`inline-flex items-center px-4 py-3 rounded text-sm font-bold font-medium transition-colors border ${
          isActive
            ? 'bg-[#FFEA9E] text-[#0a1628] border-[#FFEA9E]'
            : 'bg-[rgba(255,234,158,0.10)] text-white border-[#998C5F] hover:border-[#FFEA9E]/80'
        }`}
      >
        {displayValue ?? label}
        <ChevronIcon open={open} />
      </button>

      {open && options.length > 0 && (
        <div
          role="listbox"
          className="absolute top-full mt-2 left-0 z-50 min-w-[180px] max-h-[360px] overflow-y-auto p-2 rounded-2xl border border-white/10 bg-[#0c1419] shadow-[0_8px_24px_rgba(0,0,0,0.45)] flex flex-col gap-1"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {/* Clear option */}
          {isActive && (
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full text-center px-3 py-2 text-xs font-bold text-white/40 rounded-lg hover:bg-white/5 transition-colors"
            >
              ✕ Clear filter
            </button>
          )}
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                role="option"
                aria-selected={selected}
                onClick={() => { onChange(selected ? null : opt); setOpen(false); }}
                className={[
                  'w-full text-center px-4 py-3 rounded-lg text-sm font-bold transition-colors',
                  selected
                    ? 'bg-white/[0.08] text-[#FFEA9E] [text-shadow:0_0_8px_rgba(255,234,158,0.65)]'
                    : 'text-white hover:bg-white/[0.06]',
                ].join(' ')}
              >
                {`${prefix}${opt}`}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
