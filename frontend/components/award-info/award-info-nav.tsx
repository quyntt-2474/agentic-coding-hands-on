'use client';

import Image from 'next/image';

const menuItems = [
  { id: 'top-talent', label: 'Top Talent' },
  { id: 'top-project', label: 'Top Project' },
  { id: 'top-project-leader', label: 'Top Project\nLeader' },
  { id: 'best-manager', label: 'Best Manager' },
  { id: 'signature-2025', label: 'Signature 2025\nCreator' },
  { id: 'mvp', label: 'MVP' },
];

interface AwardInfoNavProps {
  activeId: string;
  onSelect: (id: string) => void;
}

const SCROLL_OFFSET_PX = 100;

export function AwardInfoNav({ activeId, onSelect }: AwardInfoNavProps) {
  const handleClick = (id: string) => {
    onSelect(id);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="flex flex-col" aria-label="Award categories">
      {menuItems.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            className={[
              'flex items-center gap-3 py-3 text-[14px] font-bold font-[family-name:var(--font-montserrat)]',
              'transition-all duration-200 border-l-2 pl-4 text-left rounded-r-sm',
              isActive
                ? 'border-[#FFEA9E] text-[#FFEA9E] bg-white/5 [text-shadow:0px_0px_6px_#fae287,0px_4px_4px_rgba(0,0,0,0.25)]'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20',
            ].join(' ')}
          >
            {/* Target icon */}
            <Image
              src="/icons/icon-target.svg"
              alt=""
              width={20}
              height={20}
              className={`shrink-0 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40'}`}
            />
            <span className="whitespace-pre-line">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
