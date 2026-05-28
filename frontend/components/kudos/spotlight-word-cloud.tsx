'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import cloud from 'd3-cloud';
import { SpotlightWord } from '@/lib/types/kudos';

/** WordDatum extends cloud.Word with index signature required by d3-cloud constraint */
interface WordDatum {
  text: string;
  email: string;
  count: number;
  x?: number;
  y?: number;
  rotate?: number;
  size?: number;
  [key: string]: unknown; // satisfies d3-cloud Word index signature
}

interface SpotlightWordCloudProps {
  words: SpotlightWord[];
  searchTerm: string;
}

const WIDTH = 700;
const HEIGHT = 420;
const COLORS = ['#FFEA9E', '#ffffff', '#ffd166', '#e0e0e0', '#ffe5a0'];

function getFontSize(count: number, min: number, max: number): number {
  return 14 + ((count - min) / (max - min || 1)) * 34;
}

export function SpotlightWordCloud({ words, searchTerm }: SpotlightWordCloudProps) {
  const router = useRouter();
  const [laid, setLaid] = useState<WordDatum[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [mode, setMode] = useState<'pan' | 'zoom'>('pan');
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const counts = words.map((w) => w.count);
  const minC = counts.length ? Math.min(...counts) : 0;
  const maxC = counts.length ? Math.max(...counts) : 0;

  useEffect(() => {
    if (!words.length) { setLaid([]); return; }
    const input: WordDatum[] = words.map((w) => ({
      text: w.name,
      email: w.email,
      count: w.count,
      size: getFontSize(w.count, minC, maxC),
    }));

    cloud<WordDatum>()
      .size([WIDTH, HEIGHT])
      .words(input)
      .padding(6)
      .rotate(() => (Math.random() > 0.6 ? 90 : 0))
      .font('Montserrat, sans-serif')
      .fontSize((d) => d.size ?? 14)
      .on('end', setLaid)
      .start();
  }, [words, minC, maxC]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'pan') return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    setTransform((t) => ({
      ...t,
      x: dragStart.current.tx + (e.clientX - dragStart.current.x),
      y: dragStart.current.ty + (e.clientY - dragStart.current.y),
    }));
  };

  const stopDrag = () => { dragging.current = false; };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (mode !== 'zoom') return;
    e.preventDefault();
    setTransform((t) => ({
      ...t,
      scale: Math.min(4, Math.max(0.5, t.scale - e.deltaY * 0.001)),
    }));
  };

  const lowerSearch = searchTerm.toLowerCase();

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-white/5 border border-white/10" style={{ height: HEIGHT }}>
      <button
        onClick={() => setMode((m) => (m === 'pan' ? 'zoom' : 'pan'))}
        className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs bg-black/40 text-white/60 hover:text-white border border-white/10"
      >
        {mode === 'pan' ? '🔍 Zoom' : '✋ Pan'}
      </button>

      <svg
        width="100%"
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onWheel={handleWheel}
      >
        <g transform={`translate(${WIDTH / 2 + transform.x},${HEIGHT / 2 + transform.y}) scale(${transform.scale})`}>
          {laid.map((w, i) => {
            const matches = !lowerSearch || w.text.toLowerCase().includes(lowerSearch);
            return (
              <text
                key={i}
                transform={`translate(${w.x ?? 0},${w.y ?? 0}) rotate(${w.rotate ?? 0})`}
                textAnchor="middle"
                fontSize={w.size}
                fontFamily="Montserrat, sans-serif"
                fontWeight="600"
                fill={COLORS[i % COLORS.length]}
                opacity={matches ? 1 : 0.15}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onClick={() => router.push(`/kudos?receiver=${w.email}`)}
                onMouseEnter={(e) => setTooltip({ name: w.text, count: w.count, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
              >
                {w.text}
              </text>
            );
          })}
        </g>
      </svg>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-black/80 text-white text-xs pointer-events-none"
          style={{ left: tooltip.x + 8, top: tooltip.y - 24 }}
        >
          {tooltip.name} · {tooltip.count} kudos
        </div>
      )}
    </div>
  );
}
