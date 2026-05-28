"use client";

import { useCallback, useEffect, useState } from "react";
import { KudosCard } from "@/lib/types/kudos";
import { apiFetch } from "@/lib/api";
import { useInterval } from "@/lib/use-interval";
import { useTranslations } from "@/lib/i18n";
import { FilterDropdown } from "./filter-dropdown";
import { HighlightCarousel } from "./highlight-carousel";

interface Hashtag {
  id: number;
  name: string;
}

export function HighlightSection() {
  const t = useTranslations();
  const [kudos, setKudos] = useState<KudosCard[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHighlight = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeHashtag) params.set("hashtag", activeHashtag);
      if (activeDept) params.set("department", activeDept);
      const data = await apiFetch<KudosCard[]>(`/kudos/highlight?${params}`);
      setKudos(data);
    } catch {
      // silent — keep stale data
    } finally {
      setLoading(false);
    }
  }, [activeHashtag, activeDept]);

  // Initial meta fetch (hashtags + departments)
  useEffect(() => {
    Promise.all([
      apiFetch<Hashtag[]>("/hashtags"),
      apiFetch<string[]>("/departments"),
    ])
      .then(([tags, depts]) => {
        setHashtags(tags.map((t) => t.name));
        setDepartments(depts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchHighlight();
  }, [fetchHighlight]);

  // Poll every 15s
  useInterval(fetchHighlight, 15_000);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-10">
      {/* Subtitle: 24px bold white — Figma node 2940:13454 */}
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
          {t.highlightTitle}
        </h2>

        <div className="flex gap-3 flex-wrap">
          <FilterDropdown
            label={t.filterHashtag}
            options={hashtags}
            value={activeHashtag}
            onChange={setActiveHashtag}
          />
          <FilterDropdown
            label={t.filterDepartment}
            options={departments}
            value={activeDept}
            onChange={setActiveDept}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
        </div>
      ) : kudos.length === 0 ? (
        <p className="text-center text-white/40 py-12">{t.kudosEmptyFeed}</p>
      ) : (
        <HighlightCarousel items={kudos} />
      )}
    </section>
  );
}
