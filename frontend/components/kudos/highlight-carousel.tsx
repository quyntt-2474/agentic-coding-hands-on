'use client';

import { useState } from 'react';
import { KudosCard } from '@/lib/types/kudos';
import { HighlightKudosCard } from './highlight-kudos-card';

interface HighlightCarouselProps {
  items: KudosCard[];
}

/** Number of cards visible at once on desktop */
const VISIBLE = 3;

export function HighlightCarousel({ items }: HighlightCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const maxStart = Math.max(0, items.length - VISIBLE);

  const prev = () => setStartIndex((i) => Math.max(0, i - 1));
  const next = () => setStartIndex((i) => Math.min(maxStart, i + 1));

  if (items.length === 0) return null;

  // How many cards to show: 3 on desktop, 1 on mobile (handled via CSS).
  // translateX moves by one card width (1/VISIBLE of the container).
  const translatePct = startIndex * (100 / VISIBLE);

  return (
    <div className="relative w-full">
      {/* Side arrows — always rendered, hidden when at boundary */}
      <button
        onClick={prev}
        disabled={startIndex === 0}
        aria-label="Previous"
        className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full border border-white/20
                   flex items-center justify-center
                   text-xl text-white/60 leading-none
                   hover:border-[#FFEA9E]/60 hover:text-[#FFEA9E]
                   disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>

      {/* Cards track — clips overflow, each card is 1/VISIBLE of container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${translatePct}%)` }}
        >
          {items.map((kudos) => (
            <div
              key={kudos.id}
              /* Desktop: 1/3 width. Mobile/tablet: full width via responsive override */
              className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2"
            >
              <HighlightKudosCard kudos={kudos} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        disabled={startIndex >= maxStart}
        aria-label="Next"
        className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full border border-white/20
                   flex items-center justify-center
                   text-xl text-white/60 leading-none
                   hover:border-[#FFEA9E]/60 hover:text-[#FFEA9E]
                   disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>

      {/* Pagination indicator */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {/* Dot strip */}
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(Math.min(i, maxStart))}
              aria-label={`Go to item ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i >= startIndex && i < startIndex + VISIBLE
                  ? 'w-4 bg-[#FFEA9E]'
                  : 'w-1.5 bg-white/25'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-white/40 ml-2">
          {startIndex + 1}/{items.length}
        </span>
      </div>
    </div>
  );
}
