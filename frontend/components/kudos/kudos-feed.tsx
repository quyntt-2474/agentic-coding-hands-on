'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { KudosCard, KudosListResponse } from '@/lib/types/kudos';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { KudosPostCard } from './kudos-post-card';

interface KudosFeedProps {
  activeHashtag?: string | null;
  activeDept?: string | null;
  currentUserEmail?: string;
}

// Page size for the All Kudos feed: show 10 at a time, reveal more via Load More.
const LIMIT = 3;

export function KudosFeed({ activeHashtag, activeDept, currentUserEmail }: KudosFeedProps) {
  const t = useTranslations();
  const [kudos, setKudos] = useState<KudosCard[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Monotonic request id — only the latest first-page request may commit its
  // result, so a slow response (e.g. from a prior filter) can't overwrite newer data.
  const reqIdRef = useRef(0);

  const buildParams = useCallback((p: number) => {
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (activeHashtag) params.set('hashtag', activeHashtag);
    if (activeDept) params.set('department', activeDept);
    return params.toString();
  }, [activeHashtag, activeDept]);

  // Load (or reload) the first page. Defined inside the effect so its setState
  // calls happen after `await` — keeps the feed in sync on mount, on filter
  // change, and when a kudos is created elsewhere on the page.
  useEffect(() => {
    let ignore = false;
    const loadFirstPage = async () => {
      const reqId = ++reqIdRef.current;
      try {
        const res = await apiFetch<KudosListResponse>(`/kudos?${buildParams(1)}`);
        if (ignore || reqId !== reqIdRef.current) return; // unmounted or superseded
        setKudos(res.data);
        setTotal(res.total);
        setPage(1);
      } catch {
        // silent
      } finally {
        if (!ignore && reqId === reqIdRef.current) setLoading(false);
      }
    };

    loadFirstPage();
    window.addEventListener('kudos:created', loadFirstPage);
    return () => {
      ignore = true;
      window.removeEventListener('kudos:created', loadFirstPage);
    };
  }, [buildParams]);

  // Apply like/unlike updates in-place — no refetch needed.
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
            ? { ...k, likedByMe: ev.detail.likedByMe, likeCount: ev.detail.likeCount }
            : k,
        ),
      );
    };
    window.addEventListener('kudos:liked', handler);
    return () => window.removeEventListener('kudos:liked', handler);
  }, []);

  const handleLoadMore = async () => {
    // Guard against double-trigger and loading past the end.
    if (loadingMore || kudos.length >= total) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await apiFetch<KudosListResponse>(`/kudos?${buildParams(nextPage)}`);
      // Dedupe by id so an overlapping row never appends a duplicate card.
      setKudos((prev) => {
        const seen = new Set(prev.map((k) => k.id));
        return [...prev, ...res.data.filter((k) => !seen.has(k.id))];
      });
      setTotal(res.total);
      setPage(nextPage);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLikeChange = (id: string, liked: boolean, count: number) => {
    setKudos((prev) =>
      prev.map((k) => k.id === id ? { ...k, likedByMe: liked, likeCount: count } : k),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
      </div>
    );
  }

  if (kudos.length === 0) {
    return <p className="text-center text-white/40 py-12">{t.kudosEmptyFeed}</p>;
  }

  return (
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
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className="mt-2 w-full rounded-2xl bg-[#6B6A52] py-4 text-base font-bold text-[#FFF8E1] shadow-lg hover:bg-[#7C7B60] disabled:opacity-60 transition-colors"
        >
          {loadingMore ? '...' : t.loadMore}
        </button>
      )}
    </div>
  );
}
