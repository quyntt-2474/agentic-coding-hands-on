"use client";

import { useEffect, useState } from "react";
import { SpotlightWord } from "@/lib/types/kudos";
import { apiFetch } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import { SpotlightSearch } from "./spotlight-search";
import { SpotlightWordCloud } from "./spotlight-word-cloud";

export function SpotlightSection() {
  const t = useTranslations();
  const [words, setWords] = useState<SpotlightWord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<SpotlightWord[]>("/kudos/spotlight")
      .then(setWords)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalKudos = words.reduce((s, w) => s + w.count, 0);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10">
      <p
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Sun* Annual Awards 2025
      </p>

      {/* Divider — between subtitle and title+buttons (Figma node 2940:13455) */}
      <div className="h-px bg-[#2e3940] mt-4 mb-4" />

      {/* Title + filters row: space-between, center-aligned — Figma node 2940:13456 */}
      <div className="flex items-center justify-between gap-8 mb-6 flex-wrap">
        {/* Title: 57px bold gold, tracking -0.25px — Figma node 2940:13457 */}
        <h2
          className="text-[57px] font-bold text-[#FFEA9E] leading-[64px] tracking-[-0.25px]"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.spotlightTitle}
        </h2>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <span className="text-sm font-semibold text-white/60">
          {totalKudos} {t.spotlightTotal}
        </span>
        <SpotlightSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Word cloud */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
        </div>
      ) : words.length === 0 ? (
        <p className="text-center text-white/40 py-12">
          {t.kudosEmptyLeaderboard}
        </p>
      ) : (
        <SpotlightWordCloud words={words} searchTerm={searchTerm} />
      )}
    </section>
  );
}
