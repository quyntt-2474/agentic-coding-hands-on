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

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-2">
      {/* Selected chips */}
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

      {/* Add button + max note */}
      <div className="relative flex items-center gap-2">
        {canAdd && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs
                        border transition-colors
                        ${hasError && selected.length === 0
                          ? 'border-red-500 text-red-500 hover:border-red-400'
                          : 'border-[#998C5F] text-[#00101A]/70 hover:border-[#00101A] hover:text-[#00101A]'
                        }`}
          >
            {addLabel}
          </button>
        )}
        <span className="text-xs text-[#00101A]/50">{maxLabel}</span>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-10 top-full left-0 mt-1 w-56 rounded-lg border border-[#998C5F]/40
                       bg-white shadow-xl max-h-52 overflow-y-auto"
          >
            {loadError && (
              <p className="text-xs text-red-500 text-center py-4">Không tải được hashtag</p>
            )}
            {!loadError && allTags.length === 0 && (
              <div className="flex justify-center py-4">
                <div className="w-4 h-4 rounded-full border-2 border-[#998C5F]/30 border-t-[#998C5F] animate-spin" />
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
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm
                              transition-colors text-left
                              ${disabled
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-black/5 cursor-pointer'
                              }
                              ${active ? 'text-[#00101A] font-semibold bg-[#FFEA9E]/40' : 'text-[#00101A]/80'}`}
                >
                  <span>#{tag.name}</span>
                  {active && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
