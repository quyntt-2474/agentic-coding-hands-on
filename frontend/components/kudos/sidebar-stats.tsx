"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { KudosStats } from "@/lib/types/kudos";
import { apiFetch } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import { KudosToast } from "./kudos-toast";

export function SidebarStats() {
  const t = useTranslations();
  const [stats, setStats] = useState<KudosStats | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    setIsAuthed(true);
    apiFetch<KudosStats>("/kudos/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleOpenGift = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  if (!isAuthed) {
    return (
      <p className="text-xs text-white/30 text-center py-4">
        {t.loginRequired}
      </p>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-5 h-5 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
      </div>
    );
  }

  const kudosRows = [
    { label: t.kudosReceived, value: stats.kudosReceived },
    { label: t.kudosSent, value: stats.kudosSent },
    { label: t.heartsReceived, value: stats.heartsReceived, doubled: true },
  ];

  const boxRows = [
    { label: t.secretBoxOpened, value: 0 },
    { label: t.secretBoxUnopened, value: 0 },
  ];

  return (
    <div className="flex flex-col gap-4">
      {kudosRows.map((row) => (
        <StatRow key={row.label} {...row} />
      ))}

      <hr className="border-white/10" />

      {boxRows.map((row) => (
        <StatRow key={row.label} {...row} />
      ))}

      {/* Solid gold button — matches Figma: bg #FFEA9E, radius 8px, dark text, icon right */}
      <button
        onClick={handleOpenGift}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-lg
                   bg-[#FFEA9E] text-[#0a1628] text-base font-bold
                   hover:bg-[#ffe570] active:scale-[0.98] transition-all"
      >
        {t.openGiftButton}
        {/* MM_MEDIA_Open Gift icon from public/icons */}
        <Image
          src="/icons/icon-open-gift.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden
        />
      </button>

      <KudosToast message={t.kudosComingSoon} visible={showToast} />
    </div>
  );
}

function StatRow({
  label,
  value,
  doubled,
}: {
  label: string;
  value: number;
  doubled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-white font-bold text-sm">
        {label}
        {doubled && (
          <span
            className="relative inline-flex items-center justify-center text-lg leading-none"
            aria-hidden
          >
            🔥
            <span
              className="absolute -bottom-0.5 text-[8px] font-extrabold text-white"
              style={{ WebkitTextStroke: "0.5px #000" }}
            >
              x2
            </span>
          </span>
        )}
      </span>
      <span className="text-[#FFEA9E] font-bold text-2xl leading-none">
        {value}
      </span>
    </div>
  );
}
