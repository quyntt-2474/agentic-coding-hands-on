'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';
import { RecipientProfile, SpotlightWord, SpotlightRecent } from '@/lib/types/kudos';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { SpotlightSearch } from './spotlight-search';
import { SpotlightPlexusBg } from './spotlight-plexus-bg';
import { RecipientHoverCard } from './recipient-hover-card';
import { WriteKudosModal } from './write-kudos-modal';

interface WordDatum {
  text: string;
  email: string;
  count: number;
  x?: number;
  y?: number;
  size?: number;
  /** per-word jitter — keeps drift animation phase stable across renders */
  driftSeed: number;
  [key: string]: unknown;
}

interface SpotlightWordCloudProps {
  words: SpotlightWord[];
  recent: SpotlightRecent[];
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

const WIDTH = 1157;
const HEIGHT = 548;
const COLORS = ['#FFEA9E', '#ffffff', '#ffd166', '#e0e0e0', '#ffe5a0'];
const HIGHLIGHT_COLOR = '#FF7A59';
const NAME_FONT_SIZE = 14;
const SCATTER_SEED = 20260529;
/** Gap (px) reserved on every side of each name inside its cell. */
const SCATTER_PADDING = 12;
/** Conservative char-to-px ratio for Montserrat — sized up for Vietnamese diacritics. */
const CHAR_WIDTH_RATIO = 0.62;
/** Vertical box height — 1.5 of font size to clear stacked diacritic marks (ụ, ỹ, ậ…). */
const NAME_HEIGHT = NAME_FONT_SIZE * 1.5;
/** Cap on instances per recipient — keeps board breathable for long names. */
const MAX_INSTANCES_PER_NAME = 8;
/** Reserved vertical strips so the grid doesn't push names under the header
 *  ("XX KUDOS") at the top or the recent-feed list at the bottom. */
const TOP_RESERVE = 56;
const BOTTOM_RESERVE = 100;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${m}${ampm}`;
}

export function SpotlightWordCloud({
  words,
  recent,
  searchTerm,
  onSearchChange,
}: SpotlightWordCloudProps) {
  const router = useRouter();
  const t = useTranslations();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Hover-card state: which email's profile to fetch + where to anchor the card.
  // `profileCache` memoizes fetched profiles so re-hover is instant.
  const [hovered, setHovered] = useState<{ email: string; x: number; y: number } | null>(null);
  const [profileCache, setProfileCache] = useState<Record<string, RecipientProfile>>({});
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // CTA writes a kudo to the hovered recipient. Reuses WriteKudosModal so the
  // experience matches the existing send-kudo flow.
  const [writeTarget, setWriteTarget] = useState<RecipientProfile | null>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const totalKudos = useMemo(() => words.reduce((s, w) => s + w.count, 0), [words]);

  // Grid-fitted scatter — pick grid dimensions so EVERY cell holds exactly one
  // instance and cells tile the full board. Guarantees: (1) no two names share
  // a cell, so no overlap; (2) cells cover the entire WIDTH×HEIGHT, so names
  // can never cluster in one corner.
  const laid = useMemo<WordDatum[]>(() => {
    if (!words.length) return [];
    const rand = mulberry32(SCATTER_SEED);
    const widthOf = (name: string) => name.length * NAME_FONT_SIZE * CHAR_WIDTH_RATIO;

    // 1. Build instance list — repeat each recipient by kudos count, then shuffle
    //    so instances of the same recipient don't end up in adjacent cells.
    type Slot = { w: SpotlightWord; wi: number; i: number };
    const slots: Slot[] = [];
    words.forEach((w, wi) => {
      const n = Math.max(3, Math.min(MAX_INSTANCES_PER_NAME, Math.ceil(w.count / 2)));
      for (let i = 0; i < n; i++) slots.push({ w, wi, i });
    });
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    // 2. Choose cols×rows so cells tile the USABLE board AND fit the longest
    //    name. Vertical strips are reserved for the header ("XX KUDOS") and
    //    the recent-feed list, so the grid only spans `usableH` vertically.
    const usableH = HEIGHT - TOP_RESERVE - BOTTOM_RESERVE;
    const maxNameW = Math.max(...words.map((w) => widthOf(w.name)));
    const minCellW = maxNameW + SCATTER_PADDING * 2;
    const minCellH = NAME_HEIGHT + SCATTER_PADDING * 2;
    const maxCols = Math.max(1, Math.floor(WIDTH / minCellW));
    const maxRows = Math.max(1, Math.floor(usableH / minCellH));

    const N = slots.length;
    const aspect = WIDTH / usableH;
    let cols = Math.min(maxCols, Math.max(1, Math.ceil(Math.sqrt(N * aspect))));
    const rows = Math.min(maxRows, Math.max(1, Math.ceil(N / cols)));
    // If row cap forces fewer total cells than N, redistribute toward cols.
    if (cols * rows < N) {
      cols = Math.min(maxCols, Math.ceil(N / rows));
    }
    const totalCells = cols * rows;

    // 3. Drop overflow slots (worst case: longest name + many instances).
    if (N > totalCells) slots.length = totalCells;

    // 4. Cells tile the usable area — full width, but vertically inset by
    //    TOP_RESERVE / BOTTOM_RESERVE so names never collide with overlay UI.
    const cellW = WIDTH / cols;
    const cellH = usableH / rows;
    const gridTop = -HEIGHT / 2 + TOP_RESERVE;

    // 5. Stratified cell assignment: pick exactly one cell per slot, shuffled
    //    so order doesn't betray the grid. Since we pick ALL cells (cellOrder
    //    is a full permutation up to slots.length), clustering is impossible.
    const cellOrder = Array.from({ length: totalCells }, (_, i) => i);
    for (let i = cellOrder.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [cellOrder[i], cellOrder[j]] = [cellOrder[j], cellOrder[i]];
    }

    return slots.map((slot, idx) => {
      const cellIdx = cellOrder[idx];
      const col = cellIdx % cols;
      const row = Math.floor(cellIdx / cols);
      const cx = -WIDTH / 2 + (col + 0.5) * cellW;
      const cy = gridTop + (row + 0.5) * cellH;

      // Bounded jitter — name stays inside its cell, so neighbouring names
      // never overlap. Drift animation adds ±4px on top, still safe.
      const halfW = widthOf(slot.w.name) / 2;
      const jitterX = Math.max(0, cellW / 2 - halfW - SCATTER_PADDING);
      const jitterY = Math.max(0, cellH / 2 - NAME_HEIGHT / 2 - SCATTER_PADDING);
      const x = cx + (rand() * 2 - 1) * jitterX;
      const y = cy + (rand() * 2 - 1) * jitterY;

      return {
        text: slot.w.name,
        email: slot.w.email,
        count: slot.w.count,
        size: NAME_FONT_SIZE,
        x,
        y,
        driftSeed: ((slot.wi * 17 + slot.i * 31) * 9301 + 49297) % 233280 / 233280,
      };
    });
  }, [words]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    setPan({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    });
  };
  const stopDrag = () => { dragging.current = false; };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    setScale((s) => Math.min(4, Math.max(0.5, s - e.deltaY * 0.001)));
  };

  /** Show the hover card for a name and fetch its profile on demand. */
  const showCard = (email: string, clientX: number, clientY: number) => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    setHovered({ email, x: clientX, y: clientY });
    if (profileCache[email]) return;
    apiFetch<RecipientProfile>(`/kudos/recipient/${encodeURIComponent(email)}/profile`)
      .then((p) => setProfileCache((c) => ({ ...c, [email]: p })))
      .catch(() => { /* swallow — card stays in skeleton state */ });
  };

  /** Hide with grace delay so the cursor can travel from name → card. */
  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHovered(null), 220);
  };

  /** Mouse re-entered the card itself — cancel the pending hide. */
  const cancelHide = () => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  };

  const zoomIn = () => setScale((s) => Math.min(4, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));
  const resetView = () => { setScale(1); setPan({ x: 0, y: 0 }); };

  const lowerSearch = searchTerm.trim().toLowerCase();

  const board = (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-black"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      {/* Ribbon backdrop — colorful strands wallpaper. Sits BEHIND every other
       *  layer (z-[-1] inside the container's stacking context) so the existing
       *  key-visual + plexus + names paint on top of it. `screen` blend lets it
       *  mix with the black base instead of replacing it. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/spotlight-bg-ribbons.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'screen',
          opacity: 0.7,
        }}
      />


      {/* Procedural plexus — sits above tree, below words. Matches Figma 2940-14174.
       *  Faded so the new ribbon backdrop reads through. */}
      <div className="absolute inset-0 z-[1] opacity-65 pointer-events-none">
        <SpotlightPlexusBg width={WIDTH} height={HEIGHT} />
      </div>

      <style jsx>{`
        @keyframes spotlight-drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(4px, -3px); }
          50% { transform: translate(-3px, 4px); }
          75% { transform: translate(3px, 2px); }
        }
      `}</style>

      {/* Top overlay — search (left) + total kudos (center) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto w-64">
          <SpotlightSearch value={searchTerm} onChange={onSearchChange} />
        </div>
        <h3
          className="text-white font-bold text-2xl md:text-3xl tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {totalKudos} {t.spotlightTotal}
        </h3>
        <div className="w-64" />
      </div>

      {/* Word cloud SVG — z-10 so names paint above plexus + tree visual */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onWheel={handleWheel}
      >
        <g transform={`translate(${WIDTH / 2 + pan.x},${HEIGHT / 2 + pan.y}) scale(${scale})`}>
          {laid.map((w, i) => {
            const matches = !lowerSearch || w.text.toLowerCase().includes(lowerSearch);
            const isHighlight = !!lowerSearch && matches;
            const fill = isHighlight ? HIGHLIGHT_COLOR : COLORS[i % COLORS.length];
            const duration = 6 + (w.driftSeed * 6);
            const delay = -(w.driftSeed * 8);
            return (
              // Outer <g>: positioning via SVG transform attribute ONLY.
              // CSS transform from the drift animation would otherwise OVERRIDE
              // this attribute (CSS > SVG attr for transform in modern browsers)
              // — that's why a separate inner <g> carries the animation.
              //
              // onMouseDown stops propagation so the SVG-level pan handler does
              // NOT see this press as the start of a drag. Without this, even
              // a 1-2px mouse jitter during a click would re-render the cloud
              // with new pan, shifting the text out from under mouseup → click
              // target ends up on empty SVG instead of the <g>, so the redirect
              // never fires.
              <g
                key={`${w.email}-${i}`}
                transform={`translate(${w.x ?? 0},${w.y ?? 0})`}
                style={{
                  opacity: matches ? 1 : 0.08,
                  transition: 'opacity 0.25s',
                  cursor: 'pointer',
                }}
                onMouseDown={(e) => e.stopPropagation()}
                // onClick={() => router.push(`/kudos?receiver=${w.email}`)}
                onMouseEnter={(e) => showCard(w.email, e.clientX, e.clientY)}
                onMouseLeave={scheduleHide}
              >
                <g
                  style={{
                    animation: `spotlight-drift ${duration.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
                  }}
                >
                  <text
                    textAnchor="middle"
                    fontSize={w.size}
                    fontFamily="Montserrat, sans-serif"
                    fontWeight={isHighlight ? 700 : 600}
                    fill={fill}
                  >
                    {w.text}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom-left recent feed (latest 7) */}
      {recent.length > 0 && (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none select-none">
          <ul className="flex flex-col gap-0.5 text-[12px] leading-[18px] font-[family-name:var(--font-montserrat)]">
            {recent.slice(0, 7).map((r, idx) => {
              const fade = 0.35 + ((6 - idx) / 6) * 0.55;
              return (
                <li
                  key={`${r.email}-${idx}`}
                  className="text-white whitespace-nowrap"
                  style={{ opacity: fade }}
                >
                  <span className="font-normal text-white/80 mr-2">{formatTime(r.createdAt)}</span>
                  <span className="font-bold">{r.name}</span>
                  <span className="font-normal"> {t.spotlightRecentSuffix}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Bottom-right controls — zoom + fullscreen */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded-md bg-black/40 hover:bg-black/60 border border-white/10 text-white/80 hover:text-white text-base leading-none flex items-center justify-center"
          aria-label="Zoom out"
        >−</button>
        <button
          onClick={resetView}
          className="px-2 h-8 rounded-md bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white text-[11px]"
          aria-label="Reset"
        >{Math.round(scale * 100)}%</button>
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded-md bg-black/40 hover:bg-black/60 border border-white/10 text-white/80 hover:text-white text-base leading-none flex items-center justify-center"
          aria-label="Zoom in"
        >+</button>
        <button
          onClick={() => setIsFullscreen((v) => !v)}
          className="w-8 h-8 rounded-md bg-black/40 hover:bg-black/60 border border-white/10 text-white/80 hover:text-white flex items-center justify-center"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 14H4v5M15 10h5V5M14 14l6 6M10 10L4 4" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          )}
        </button>
      </div>

      {hovered && (
        <RecipientHoverCard
          x={hovered.x}
          y={hovered.y}
          profile={profileCache[hovered.email] ?? null}
          loading={!profileCache[hovered.email]}
          onSendKudo={() => {
            const p = profileCache[hovered.email];
            if (!p) return;
            setHovered(null);
            setWriteTarget(p);
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        />
      )}
    </div>
  );

  return (
    <>
      {isFullscreen ? (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-[1600px]">{board}</div>
        </div>
      ) : (
        board
      )}

      {writeTarget && (
        <WriteKudosModal
          initialRecipient={{
            email: writeTarget.email,
            name: writeTarget.name,
            picture: writeTarget.picture,
            department: writeTarget.department,
          }}
          onClose={() => setWriteTarget(null)}
          onSuccess={() => setWriteTarget(null)}
        />
      )}
    </>
  );
}
