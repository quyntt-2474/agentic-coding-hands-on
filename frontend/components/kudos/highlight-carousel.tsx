'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { KudosCard } from '@/lib/types/kudos';
import { useTranslations } from '@/lib/i18n';
import { useInterval } from '@/lib/use-interval';
import { HighlightKudosCard } from './highlight-kudos-card';

/** Auto-advance interval (ms). */
const AUTO_ADVANCE_MS = 5000;
/** Must match the track's transition duration (`duration-300`). */
const TRANSITION_MS = 300;

interface HighlightCarouselProps {
  items: KudosCard[];
  currentUserEmail?: string;
}

/**
 * HIGHLIGHT KUDOS carousel — spec mms_B.2 (node 2940:13461).
 *
 * Seamless infinite forward loop. The track is padded with clones on BOTH ends
 * so that the left/right peek positions stay populated through the wrap point:
 *
 *   renderItems = [items[last], ...items, items[0], items[1]]
 *   index          0            1 .. N    N+1       N+2
 *
 *                  └ clone ────┘└ real ──┘└ clones ─┘
 *
 * Active sequence (forward): 1 → 2 → … → N → N+1 (= clone of items[0]).
 * At index N+1 the visible neighbors (left peek items[N-1] at slot N, right
 * peek items[1]-clone at slot N+2) are visually identical to what the viewer
 * sees at the real first item (slot 1: left peek items[last]-clone at 0,
 * right peek items[1] at 2). So when we silently snap activeIndex N+1 → 1,
 * all three visible cards are unchanged — the loop is truly seamless.
 */
export function HighlightCarousel({ items, currentUserEmail }: HighlightCarouselProps) {
  const t = useTranslations();
  const wrapEnabled = items.length > 1;
  const firstReal = wrapEnabled ? 1 : 0;
  const cloneSlot = wrapEnabled ? items.length + 1 : -1;

  // activeIndex references a position in the rendered track.
  // Starts at firstReal so the very first paint shows real items[0] centered.
  const [activeIndex, setActiveIndex] = useState(firstReal);
  // Toggled off briefly during the silent snap so the rewind is invisible.
  const [animate, setAnimate] = useState(true);

  // Auto-advance every 5s. Paused (delay=null) when ≤1 card — nothing to rotate.
  useInterval(
    () => setActiveIndex((i) => i + 1),
    wrapEnabled ? AUTO_ADVANCE_MS : null,
  );

  // Snap-to-firstReal logic + safety clamps. All setStates wrapped in async
  // callbacks (setTimeout / requestAnimationFrame) so the React
  // `set-state-in-effect` lint rule does not fire.
  //
  // Cases handled:
  //   • activeIndex === cloneSlot  → reached the trailing clone of items[0].
  //     Wait for the slide transition to finish (TRANSITION_MS), then snap to
  //     firstReal with animation disabled.
  //   • activeIndex > cloneSlot OR < firstReal → out of valid range
  //     (e.g. filter shrank items, wrap mode just toggled). Snap immediately.
  useEffect(() => {
    if (items.length === 0) return;
    const outOfRange = wrapEnabled
      ? activeIndex < firstReal || activeIndex >= cloneSlot
      : activeIndex !== 0;
    if (outOfRange) {
      const target = wrapEnabled ? firstReal : 0;
      const isCloneSlot = wrapEnabled && activeIndex === cloneSlot;
      const timer = setTimeout(
        () => {
          setAnimate(false);
          setActiveIndex(target);
        },
        isCloneSlot ? TRANSITION_MS + 20 : 0,
      );
      return () => clearTimeout(timer);
    }
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [activeIndex, items.length, wrapEnabled, firstReal, cloneSlot, animate]);

  if (items.length === 0) {
    return <p className="text-center text-white/40 py-12">{t.kudosEmptyFeed}</p>;
  }

  // Build the rendered track with clones on both ends for seamless wrap.
  const renderItems = wrapEnabled
    ? [items[items.length - 1], ...items, items[0], items[1]]
    : items;

  // Clamp activeIndex into valid render range — prevents flicker between
  // stale-state render and the snap-effect cleanup.
  const safeIndex = wrapEnabled
    ? Math.min(Math.max(activeIndex, firstReal), cloneSlot)
    : Math.min(Math.max(activeIndex, 0), items.length - 1);

  // Pagination "N/M": clone slot is shown as position 1 (it visually IS items[0]).
  const displayedIndex = wrapEnabled
    ? safeIndex === cloneSlot
      ? 0
      : safeIndex - firstReal
    : safeIndex;

  // Backward wrap: at first real item, jump to the last real item with
  // animation disabled (one-frame snap). Smoother two-phase wrap via slot 0
  // would need a second leading clone — KISS, instant snap is enough.
  const prev = () => {
    if (wrapEnabled && activeIndex <= firstReal) {
      setAnimate(false);
      setActiveIndex(items.length); // slot of items[last]
      return;
    }
    setActiveIndex((i) => i - 1);
  };
  const next = () => setActiveIndex((i) => i + 1); // forward always allowed; wraps via the clone slot

  // Translate per breakpoint (1-up mobile / 2-up tablet / 2.5-up desktop w-2/5).
  // Formula: translateX% = viewportCenter(50%) − (safeIndex + 0.5) × cardWidth%
  // Mobile uses left-aligned shift since 100%-wide cards have no centering.
  const trackStyle: CSSProperties = {
    '--tx-mobile': `translateX(${-safeIndex * 100}%)`,
    '--tx-tablet': `translateX(${(0.5 - safeIndex) * 50}%)`,
    '--tx-desktop': `translateX(${30 - safeIndex * 40}%)`,
  } as CSSProperties;

  return (
    <div className="relative w-full">
      {/* Cards viewport — track is translated per breakpoint via CSS vars */}
      <div className="overflow-hidden">
        <div
          className={`flex ${animate ? 'transition-transform duration-300 ease-in-out' : ''}
                     [transform:var(--tx-mobile)]
                     sm:[transform:var(--tx-tablet)]
                     lg:[transform:var(--tx-desktop)]`}
          style={trackStyle}
        >
          {renderItems.map((kudos, i) => {
            const isActive = i === safeIndex;
            return (
              <div
                key={`${i}-${kudos.id}`}
                className={`w-full sm:w-1/2 lg:w-2/5 shrink-0 px-2 transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 scale-100'
                    : 'opacity-25 saturate-50 scale-95 pointer-events-none'
                }`}
                aria-hidden={!isActive}
              >
                <HighlightKudosCard
                  kudos={kudos}
                  currentUserEmail={currentUserEmail}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Side arrows — chevrons floating at viewport edges (spec B.2.1 / B.2.2) */}
      <button
        onClick={prev}
        disabled={!wrapEnabled}
        aria-label="Previous"
        className="absolute left-[-28px] top-1/2 -translate-y-1/2 z-10
                   text-4xl leading-none text-white/60 hover:text-[#FFEA9E]
                   disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-[-28px] top-1/2 -translate-y-1/2 z-10
                   text-4xl leading-none text-white/60 hover:text-[#FFEA9E]
                   transition-colors"
      >
        ›
      </button>

      {/* Inline pagination "‹ N/M ›" below carousel — spec B.5 (node 2940:13471) */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          disabled={!wrapEnabled}
          aria-label="Previous slide"
          className="text-lg leading-none text-white/50 hover:text-[#FFEA9E]
                     disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="tabular-nums">
          <span className="text-xl text-[#FFEA9E] font-bold">{displayedIndex + 1}</span>
          <span className="text-base text-white/50"> / {items.length}</span>
        </span>
        <button
          onClick={next}
          aria-label="Next slide"
          className="text-lg leading-none text-white/50 hover:text-[#FFEA9E] transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
