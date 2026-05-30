'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface KudosToastProps {
  message: string;
  visible: boolean;
}

export function KudosToast({ message, visible }: KudosToastProps) {
  // Render into document.body via a portal so the fixed-position toast anchors
  // to the viewport, not an ancestor with a containing block (e.g. the header's
  // backdrop-blur). Guarded for SSR — portals require the DOM.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-50',
        'bg-[#1a2a3a] text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)]',
        'px-6 py-3 rounded-full shadow-lg border border-[#2e3940]',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
      ].join(' ')}
    >
      {message}
    </div>,
    document.body,
  );
}
