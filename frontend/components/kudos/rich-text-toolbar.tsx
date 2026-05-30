'use client';

import { ReactNode } from 'react';

export interface RichTextToolbarState {
  isBoldActive: boolean;
  isItalicActive: boolean;
  isStrikeActive: boolean;
  isOrderedListActive: boolean;
  isLinkActive: boolean;
  isBlockquoteActive: boolean;
}

export interface RichTextToolbarProps extends RichTextToolbarState {
  onBold: () => void;
  onItalic: () => void;
  onStrike: () => void;
  onOrderedList: () => void;
  /** Prompts for URL and applies link */
  onLink: () => void;
  onBlockquote: () => void;
  /** Optional content rendered on the right side of the toolbar (e.g. a link) */
  rightSlot?: ReactNode;
}

interface Btn {
  label: string;
  title: string;
  active: boolean;
  action: () => void;
}

export function RichTextToolbar({
  isBoldActive, isItalicActive, isStrikeActive,
  isOrderedListActive, isLinkActive, isBlockquoteActive,
  onBold, onItalic, onStrike, onOrderedList, onLink, onBlockquote,
  rightSlot,
}: RichTextToolbarProps) {
  const buttons: Btn[] = [
    { label: 'B',   title: 'Bold',         active: isBoldActive,        action: onBold },
    { label: 'I',   title: 'Italic',       active: isItalicActive,      action: onItalic },
    { label: 'S',   title: 'Strikethrough',active: isStrikeActive,      action: onStrike },
    { label: '1.', title: 'Ordered list',  active: isOrderedListActive, action: onOrderedList },
    { label: '🔗', title: 'Link',          active: isLinkActive,        action: onLink },
    { label: '"',  title: 'Blockquote',    active: isBlockquoteActive,  action: onBlockquote },
  ];

  return (
    <div className="flex items-center justify-between gap-1 px-2 py-1.5 border-b border-[#998C5F]/40">
      <div className="flex items-center gap-1">
        {buttons.map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault(); // keep editor focus
              btn.action();
            }}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold
                        transition-colors select-none
                        ${btn.active
                          ? 'bg-[#FFEA9E] text-[#00101A]'
                          : 'text-[#00101A]/70 hover:text-[#00101A] hover:bg-black/5'
                        }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {rightSlot}
    </div>
  );
}
