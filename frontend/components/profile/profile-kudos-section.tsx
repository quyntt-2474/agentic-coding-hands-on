"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KudosCard, KudosListResponse } from "@/lib/types/kudos";
import { apiFetch } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import { KudosPostCard } from "@/components/kudos/kudos-post-card";

type FilterMode = "sent" | "received";

const LIMIT = 3;

interface ProfileKudosSectionProps {
  email: string;
  currentUserEmail?: string;
}

/**
 * Sections C + D — "Sun* Annual Awards 2025" header, KUDOS title, filter
 * dropdown toggling sent/received, and a paginated kudos list (Load More).
 * Mirrors the KudosFeed pagination pattern exactly.
 */
export function ProfileKudosSection({
  email,
  currentUserEmail,
}: ProfileKudosSectionProps) {
  const t = useTranslations();
  const [filter, setFilter] = useState<FilterMode>("sent");
  const [kudos, setKudos] = useState<KudosCard[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const reqIdRef = useRef(0);

  const buildUrl = useCallback(
    (p: number) => {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(LIMIT),
      });
      if (filter === "sent") {
        params.set("sender", email);
      } else {
        params.set("receiver", email);
      }
      return `/kudos?${params.toString()}`;
    },
    [filter, email],
  );

  // Load / reload first page whenever filter or email changes.
  useEffect(() => {
    let ignore = false;
    const reqId = ++reqIdRef.current;

    setLoading(true);
    setError(false);
    setKudos([]);
    setPage(1);
    setTotal(0);

    apiFetch<KudosListResponse>(buildUrl(1))
      .then((res) => {
        if (ignore || reqId !== reqIdRef.current) return;
        setKudos(res.data);
        setTotal(res.total);
        setPage(1);
      })
      .catch(() => {
        if (!ignore && reqId === reqIdRef.current) setError(true);
      })
      .finally(() => {
        if (!ignore && reqId === reqIdRef.current) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [buildUrl]);

  // Keep like counts in sync with window events from KudosPostCard.
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{
        id: string;
        likedByMe: boolean;
        likeCount: number;
      }>;
      setKudos((prev) =>
        prev.map((k) =>
          k.id === ev.detail.id
            ? {
                ...k,
                likedByMe: ev.detail.likedByMe,
                likeCount: ev.detail.likeCount,
              }
            : k,
        ),
      );
    };
    window.addEventListener("kudos:liked", handler);
    return () => window.removeEventListener("kudos:liked", handler);
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || kudos.length >= total) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await apiFetch<KudosListResponse>(buildUrl(nextPage));
      setKudos((prev) => {
        const seen = new Set(prev.map((k) => k.id));
        return [...prev, ...res.data.filter((k) => !seen.has(k.id))];
      });
      setTotal(res.total);
      setPage(nextPage);
    } catch {
      // silent — user can retry via Load More
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLikeChange = (id: string, liked: boolean, count: number) => {
    setKudos((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, likedByMe: liked, likeCount: count } : k,
      ),
    );
  };

  const sentLabel = `${t.profileFilterSent} (${filter === "sent" ? total : "…"})`;
  const receivedLabel = `${t.profileFilterReceived} (${filter === "received" ? total : "…"})`;

  return (
    <section
      className="px-4 py-6 flex flex-col gap-5"
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      {/* Section C header */}
      <div className="flex flex-col">
        <p
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.profileAnnualAwardsTitle}
        </p>

        <div className="h-px bg-[#2e3940] mt-4 mb-4" />

        <div className="flex items-center justify-between gap-8 flex-wrap">
          <h2
            className="text-[57px] font-bold text-[#FFEA9E] leading-[64px] tracking-[-0.25px]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t.profileKudosTitle}
          </h2>

          {/* Filter dropdown */}
          <div className="shrink-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterMode)}
              className="rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold
                         px-3 py-2 appearance-none cursor-pointer hover:bg-white/15 transition-colors
                         focus:outline-none focus:ring-1 focus:ring-[#FFEA9E]/50"
              aria-label="Filter kudos"
            >
              <option value="sent" className="bg-[#0c1419] text-white">
                {sentLabel}
              </option>
              <option value="received" className="bg-[#0c1419] text-white">
                {receivedLabel}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Section D — kudos list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
        </div>
      ) : error ? (
        <p className="text-center text-white/40 py-12">
          {t.profileKudosLoadError}
        </p>
      ) : kudos.length === 0 ? (
        <p className="text-center text-white/40 py-12">{t.kudosEmptyFeed}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {kudos.map((k) => (
            <KudosPostCard
              key={k.id}
              kudos={k}
              currentUserEmail={currentUserEmail}
              onLikeChange={handleLikeChange}
            />
          ))}

          {kudos.length < total && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mt-2 w-full rounded-2xl bg-[#6B6A52] py-4 text-base font-bold
                         text-[#FFF8E1] shadow-lg hover:bg-[#7C7B60] disabled:opacity-60
                         transition-colors"
            >
              {loadingMore ? "..." : t.loadMore}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
