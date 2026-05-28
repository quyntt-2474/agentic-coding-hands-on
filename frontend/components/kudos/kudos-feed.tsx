'use client';

import { useCallback, useEffect, useState } from 'react';
import { KudosCard, KudosListResponse } from '@/lib/types/kudos';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { KudosPostCard } from './kudos-post-card';

interface KudosFeedProps {
  activeHashtag?: string | null;
  activeDept?: string | null;
  currentUserEmail?: string;
}

const LIMIT = 20;

export function KudosFeed({ activeHashtag, activeDept, currentUserEmail }: KudosFeedProps) {
  const t = useTranslations();
  const [kudos, setKudos] = useState<KudosCard[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const buildParams = useCallback((p: number) => {
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (activeHashtag) params.set('hashtag', activeHashtag);
    if (activeDept) params.set('department', activeDept);
    return params.toString();
  }, [activeHashtag, activeDept]);

  const fetchFirstPage = useCallback(async () => {
    try {
      const res = await apiFetch<KudosListResponse>(`/kudos?${buildParams(1)}`);
      setKudos(res.data);
      setTotal(res.total);
      setPage(1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    setLoading(true);
    fetchFirstPage();
  }, [fetchFirstPage]);

  // Refetch first page when a new kudos is created elsewhere on the page
  useEffect(() => {
    const handler = () => fetchFirstPage();
    window.addEventListener('kudos:created', handler);
    return () => window.removeEventListener('kudos:created', handler);
  }, [fetchFirstPage]);

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
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await apiFetch<KudosListResponse>(`/kudos?${buildParams(nextPage)}`);
      setKudos((prev) => [...prev, ...res.data]);
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
          className="mt-2 self-center px-6 py-2 rounded-full border border-white/20 text-sm text-white/60 hover:border-[#FFEA9E]/50 hover:text-[#FFEA9E] disabled:opacity-50 transition-colors"
        >
          {loadingMore ? '...' : t.loadMore}
        </button>
      )}
    </div>
  );
}
