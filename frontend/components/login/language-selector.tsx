'use client';

import { useEffect, useRef, useState } from 'react';

const LANGUAGES = [
  { code: 'VN', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

export function LanguageSelector() {
  const [selected, setSelected] = useState<LangCode>('VN');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lang') as LangCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      setSelected(stored);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function select(code: LangCode) {
    setSelected(code);
    localStorage.setItem('lang', code);
    setIsOpen(false);
  }

  const current = LANGUAGES.find((l) => l.code === selected)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-white text-sm font-medium hover:bg-white/10 cursor-pointer transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.code}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 w-36 rounded shadow-lg bg-[#0d1e3a] border border-white/10 overflow-hidden z-50"
        >
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === selected}
              onClick={() => select(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors
                ${lang.code === selected ? 'text-white bg-white/10' : 'text-white/80 hover:bg-white/10'}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
