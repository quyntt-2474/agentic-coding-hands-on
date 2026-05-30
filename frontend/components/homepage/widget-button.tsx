'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RuleModal } from './rule-modal';

export function WidgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTheLe, setShowTheLe] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleTheLe = () => {
    setIsOpen(false);
    setShowTheLe(true);
  };

  const handleVietKudos = () => {
    setIsOpen(false);
    router.push('/kudos');
  };

  return (
    <>
    <RuleModal
      isOpen={showTheLe}
      onClose={() => setShowTheLe(false)}
      onVietKudos={() => { setShowTheLe(false); router.push('/kudos'); }}
    />
    <div
      ref={containerRef}
      className="fixed bottom-[98px] right-[19px] z-50"
    >
      {isOpen ? (
        /* Expanded state — flex column, right-aligned, bottom-anchored */
        <div className="flex flex-col items-end gap-5">
          {/* A: Thể lệ */}
          <button
            type="button"
            aria-label="Thể lệ"
            onClick={handleTheLe}
            className="flex items-center gap-2 rounded bg-[#FFEA9E] px-4 text-[#0a1628] hover:shadow-md transition-shadow"
            style={{ height: '64px' }}
          >
            <Image
              src="/icons/icon-kudos-logo.svg"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="text-[14px] font-bold whitespace-nowrap">Thể lệ</span>
          </button>

          {/* B: Viết KUDOS */}
          <button
            type="button"
            aria-label="Viết KUDOS"
            onClick={handleVietKudos}
            className="flex items-center gap-2 rounded bg-[#FFEA9E] px-4 text-[#0a1628] hover:shadow-md transition-shadow"
            style={{ height: '64px' }}
          >
            <Image
              src="/icons/icon-pen.svg"
              alt=""
              width={24}
              height={24}
              className="shrink-0 brightness-0"
            />
            <span className="text-[14px] font-bold whitespace-nowrap">Viết KUDOS</span>
          </button>

          {/* C: Hủy / Close */}
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center rounded-full bg-[#D4271D] hover:shadow-md transition-shadow self-end"
            style={{ width: '56px', height: '56px' }}
          >
            <span className="text-white text-[24px] font-bold leading-none select-none">×</span>
          </button>
        </div>
      ) : (
        /* Closed state — pill button */
        <button
          type="button"
          aria-label="SAA Kudos widget"
          className="flex items-center gap-2 px-4 rounded-full bg-[#FFEA9E] hover:shadow-lg transition-shadow"
          style={{
            width: '106px',
            height: '64px',
            boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287',
          }}
          onClick={() => setIsOpen(true)}
        >
          <Image
            src="/icons/icon-pen.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 brightness-0"
          />
          <span className="text-[#0a1628] text-[16px] font-bold shrink-0">/</span>
          <Image
            src="/icons/icon-kudos-logo.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0"
          />
        </button>
      )}
    </div>
    </>
  );
}
