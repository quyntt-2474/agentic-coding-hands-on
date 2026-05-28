'use client';

import { useEffect, useRef, useState } from 'react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
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

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        {value ?? label}
        <ChevronIcon open={open} />
      </button>

      {open && options.length > 0 && (
        <div className="absolute top-full mt-1 left-0 z-50 min-w-[160px] rounded-lg border border-white/10 bg-[#0d1f33] shadow-lg overflow-hidden">
          {/* Clear option */}
          {isActive && (
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-white/40 hover:bg-white/5"
            >
              ✕ Clear filter
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt === value ? null : opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                opt === value ? 'text-[#FFEA9E]' : 'text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
