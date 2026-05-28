'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const BADGES = [
  { id: 'REVIVAL',              gradient: 'from-orange-700 via-amber-800 to-stone-900' },
  { id: 'TOUCH OF LIGHT',       gradient: 'from-sky-300 via-blue-500 to-indigo-800' },
  { id: 'STAY GOLD',            gradient: 'from-yellow-300 via-amber-500 to-yellow-800' },
  { id: 'FLOW TO HORIZON',      gradient: 'from-teal-400 via-cyan-600 to-blue-800' },
  { id: 'BEYOND THE BOUNDARY',  gradient: 'from-purple-400 via-violet-600 to-purple-900' },
  { id: 'ROOT FUTHER',          gradient: 'from-green-600 via-emerald-700 to-green-900' },
];

const HERO_LEVELS = [
  {
    name: 'New Hero',
    condition: 'Có 1-4 người gửi Kudos cho bạn',
    desc: 'Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.',
  },
  {
    name: 'Rising Hero',
    condition: 'Có 5-9 người gửi Kudos cho bạn',
    desc: 'Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.',
  },
  {
    name: 'Super Hero',
    condition: 'Có 10–20 người gửi Kudos cho bạn',
    desc: 'Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.',
  },
  {
    name: 'Legend Hero',
    condition: 'Có hơn 20 người gửi Kudos cho bạn',
    desc: 'Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.',
  },
];

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVietKudos: () => void;
}

/** Thể lệ Kudos — slide-up panel on mobile, right-drawer on desktop */
export function RuleModal({ isOpen, onClose, onVietKudos }: RuleModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Double rAF: ensure initial hidden state is painted before transition starts
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Thể lệ"
        className={`fixed z-[61] inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto flex flex-col
          transition-transform duration-300 ease-out
          ${visible
            ? 'translate-y-0 md:translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
      >
        <div className="flex flex-col bg-[#00101a] border-t border-[#2e3940] md:border-t-0 md:border-l md:w-[480px] md:h-full max-h-[88vh] md:max-h-full rounded-t-2xl md:rounded-none">

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-[#FFEA9E] text-[22px] font-bold font-[family-name:var(--font-montserrat)] leading-7">
                Thể lệ
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* ── Section 1: NGƯỜI NHẬN KUDOS ── */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#FFEA9E] text-[22px] font-bold font-[family-name:var(--font-montserrat)] leading-7">
                NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC
              </h3>
              <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile
              </p>

              {/* Hero level rows */}
              <div className="flex flex-col gap-4">
                {HERO_LEVELS.map((hero) => (
                  <div key={hero.name} className="flex flex-col gap-1">
                    {/* Row: chip + condition */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="inline-flex items-center shrink-0 px-3 h-[22px] rounded-full border border-[#FFEA9E] text-white text-[12px] font-bold font-[family-name:var(--font-montserrat)] whitespace-nowrap"
                        style={{ background: 'rgba(255,234,158,0.08)' }}
                      >
                        {hero.name}
                      </span>
                      <span className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                        {hero.condition}
                      </span>
                    </div>
                    {/* Description */}
                    <p className="text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] leading-5 tracking-[0.1px]">
                      {hero.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#2e3940]" />

            {/* ── Section 2: NGƯỜI GỬI KUDOS ── */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#FFEA9E] text-[22px] font-bold font-[family-name:var(--font-montserrat)] leading-7">
                NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN
              </h3>
              <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.
              </p>

              {/* 6 badges — 3-column grid, circular */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                {BADGES.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-[80px] h-[80px] rounded-full bg-gradient-to-br ${badge.gradient}`}
                      aria-hidden="true"
                    />
                    <span className="text-white text-[10px] font-bold font-[family-name:var(--font-montserrat)] leading-[14px] uppercase text-center">
                      {badge.id}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.
              </p>

              {/* KUDOS QUỐC DÂN */}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#2e3940]">
                <h3 className="text-[#FFEA9E] text-[24px] font-bold font-[family-name:var(--font-montserrat)] leading-8">
                  KUDOS QUỐC DÂN
                </h3>
                <p className="text-white text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-6 tracking-[0.5px]">
                  5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky footer — 2 action buttons */}
          <div className="shrink-0 flex gap-3 p-4 border-t border-[#2e3940] bg-[#00101a]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-white/25 text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:bg-white/5 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Đóng
            </button>
            <button
              type="button"
              onClick={onVietKudos}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#FFEA9E] text-[#0a1628] text-[14px] font-bold font-[family-name:var(--font-montserrat)] hover:bg-[#ffe57a] transition-colors"
            >
              <Image
                src="/icons/icon-pen.svg"
                alt=""
                width={16}
                height={16}
                className="brightness-0 shrink-0"
              />
              Viết KUDOS
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
