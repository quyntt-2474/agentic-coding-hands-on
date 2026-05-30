"use client";

import { useEffect, useState } from "react";
import { SpotlightWord, SpotlightRecent } from "@/lib/types/kudos";
import { apiFetch } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import { SpotlightWordCloud } from "./spotlight-word-cloud";

export function SpotlightSection() {
  const t = useTranslations();
  const [words, setWords] = useState<SpotlightWord[]>([]);
  const [recent, setRecent] = useState<SpotlightRecent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<SpotlightWord[]>("/kudos/spotlight").catch(() => [] as SpotlightWord[]),
      apiFetch<SpotlightRecent[]>("/kudos/spotlight/recent").catch(() => [] as SpotlightRecent[]),
    ])
      .then(([w, r]) => {
        setWords(w);
        setRecent(r);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <p
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Sun* Annual Awards 2025
      </p>

      <div className="h-px bg-[#2e3940] mt-4 mb-4" />

      <div className="flex items-center justify-between gap-8 mb-6 flex-wrap">
        <h2
          className="text-[57px] font-bold text-[#FFEA9E] leading-[64px] tracking-[-0.25px]"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.spotlightTitle}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
        </div>
      ) : words.length === 0 ? (
        <p className="text-center text-white/40 py-12">
          {t.kudosEmptyLeaderboard}
        </p>
      ) : (
        <SpotlightWordCloud
          words={words}
          recent={recent}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </section>
  );
}
