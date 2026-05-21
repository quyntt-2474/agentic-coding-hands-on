'use client';

import Image from 'next/image';

export function WidgetButton() {
  return (
    <div className="fixed bottom-[98px] right-[19px] z-50 cursor-default">
      <button
        type="button"
        aria-label="SAA Kudos widget"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-saa-gold w-[105px] h-[64px]"
        style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287' }}
        onClick={() => {}}
      >
        <Image
          src="/icons/icon-pen.svg"
          alt=""
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="text-[#0a1628] text-[16px] font-bold shrink-0">/</span>
        <Image
          src="/icons/icon-kudos-logo.svg"
          alt="Kudos"
          width={28}
          height={28}
          style={{ width: 28, height: 28 }}
          className="shrink-0"
        />
      </button>
    </div>
  );
}
