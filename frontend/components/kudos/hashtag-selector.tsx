'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Hashtag } from '@/lib/types/kudos';

const MAX_HASHTAGS = 5;

interface HashtagSelectorProps {
  selected: Hashtag[];
  onChange: (tags: Hashtag[]) => void;
  addLabel: string;
  maxLabel: string;
  hasError?: boolean;
}

/** 24×24 circle-check icon for selected dropdown rows (matches Figma spec A.2). */
function CheckmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      className="shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill="#FFFFFF" />
      <path
        d="M7 12.5l3 3 7-7"
        stroke="#00101A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function HashtagSelector({
  selected,
  onChange,
  addLabel,
  maxLabel,
  hasError = false,
}: HashtagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [allTags, setAllTags] = useState<Hashtag[]>([]);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch predefined hashtags on first open
  useEffect(() => {
    if (!open || allTags.length > 0 || loadError) return;
    apiFetch<Hashtag[]>('/hashtags')
      .then(setAllTags)
      .catch(() => setLoadError(true));
  }, [open, allTags.length, loadError]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isSelected = (tag: Hashtag) => selected.some((s) => s.id === tag.id);

  const toggle = (tag: Hashtag) => {
    if (isSelected(tag)) {
      onChange(selected.filter((s) => s.id !== tag.id));
    } else if (selected.length < MAX_HASHTAGS) {
      onChange([...selected, tag]);
    }
  };

  const remove = (tag: Hashtag) => {
    onChange(selected.filter((s) => s.id !== tag.id));
  };

  const canAdd = selected.length < MAX_HASHTAGS;

  // Trigger button border colour: error > disabled > normal
  const triggerBorderClass =
    hasError && selected.length === 0
      ? 'border-red-500 text-red-500'
      : !canAdd
        ? 'border-[#998C5F]/40 text-[#00101A]/40 cursor-not-allowed'
        : 'border-[#998C5F] text-[#00101A] hover:border-[#00101A]';

  return (
    <div ref={containerRef} className="flex flex-wrap items-start gap-2">
      {/* Selected chips — kept for at-a-glance read of current selection */}
      {selected.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                     bg-[#FFEA9E] text-[#00101A] border border-[#998C5F]/40"
        >
          #{tag.name}
          <button
            type="button"
            onClick={() => remove(tag)}
            className="w-3.5 h-3.5 flex items-center justify-center rounded-full
                       hover:bg-black/10 transition-colors text-[#00101A]/60
                       hover:text-[#00101A] leading-none"
            aria-label={`Remove #${tag.name}`}
          >
            ✕
          </button>
        </span>
      ))}

      {/* Add trigger + dropdown — matches Figma frame p9zO-c4a4x */}
      <div className="relative">
        <button
          type="button"
          onClick={() => canAdd && setOpen((o) => !o)}
          disabled={!canAdd}
          className={`flex flex-col items-start gap-0.5 px-4 py-2 rounded-lg border
                      bg-transparent transition-colors ${triggerBorderClass}`}
        >
          <span className="text-sm font-bold leading-tight">{addLabel}</span>
          <span className="text-[11px] leading-tight opacity-70">{maxLabel}</span>
        </button>

        {/* Dropdown — dark surface per design */}
        {open && (
          <div
            className="absolute z-10 top-full left-0 mt-1 w-72 rounded-lg border border-[#998C5F]/40
                       bg-[#1A1410] shadow-xl max-h-72 overflow-y-auto"
          >
            {loadError && (
              <p className="text-xs text-red-400 text-center py-4">Không tải được hashtag</p>
            )}
            {!loadError && allTags.length === 0 && (
              <div className="flex justify-center py-4">
                <div className="w-4 h-4 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
              </div>
            )}
            {allTags.map((tag) => {
              const active = isSelected(tag);
              const disabled = !active && !canAdd;
              return (
                <button
                  key={tag.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(tag)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm
                              text-white transition-colors text-left
                              ${disabled
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-white/5 cursor-pointer'
                              }
                              ${active ? 'bg-white/5 font-bold' : ''}`}
                >
                  <span className="truncate">#{tag.name}</span>
                  {active && <CheckmarkIcon />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
