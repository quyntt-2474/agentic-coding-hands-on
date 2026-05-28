'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KudosCard } from '@/lib/types/kudos';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { formatKudosDate } from '@/lib/format-date';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { KudosToast } from './kudos-toast';
import { UserVerticalBlock } from './user-info-block';
import { PaperPlaneIcon, HeartIcon, LinkIcon } from './kudos-icons';

interface KudosDetailModalProps {
  id: string;
}

const numberFormatter = new Intl.NumberFormat('vi-VN');

/**
 * Kudos detail modal — backdrop + close button + a cream/gold inner card
 * matching the highlight card's content. Shows the full message (no
 * line-clamp), every attached image, and a Like + Copy Link action row
 * (no "Xem chi tiết" — we're already on the detail surface).
 */
export function KudosDetailModal({ id }: KudosDetailModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const [kudos, setKudos] = useState<KudosCard | null>(null);
  const [loading, setLoading] = useState(true);

  // Current user (for like ownership check) — derived once from JWT in localStorage
  const [currentUserEmail] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    const token = localStorage.getItem('auth_token');
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email as string;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    apiFetch<KudosCard>(`/kudos/${id}`)
      .then(setKudos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleClose = useCallback(() => {
    if (window.history.length <= 1) {
      router.push('/kudos');
    } else {
      router.back();
    }
  }, [router]);

  // ESC key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
    >
      {/* Dialog wrapper (cream/gold to match other surfaces) */}
      <div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFF8E1] border-4 border-[#FFEA9E] shadow-2xl">
        <button
          onClick={handleClose}
          aria-label={t.closeDialog}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border border-[#FFEA9E] text-[#444] hover:text-[#00101A] hover:border-[#B8860B] bg-[#FFF8E1] transition-colors"
        >
          ✕
        </button>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/40 border-t-[#B8860B] animate-spin" />
          </div>
        )}

        {!loading && !kudos && (
          <p className="text-center text-[#666] py-20">Not found.</p>
        )}

        {kudos && (
          <DetailContent
            kudos={kudos}
            currentUserEmail={currentUserEmail}
            t={t}
          />
        )}
      </div>
    </div>
  );
}

interface DetailContentProps {
  kudos: KudosCard;
  currentUserEmail?: string;
  t: ReturnType<typeof useTranslations>;
}

/**
 * Inner detail content — separated so hooks (useState/useMemo for like + toast)
 * mount only when kudos data is loaded, keeping the loading/empty branches
 * hook-free.
 */
function DetailContent({ kudos, currentUserEmail, t }: DetailContentProps) {
  const [liked, setLiked] = useState(kudos.likedByMe);
  const [likeCount, setLikeCount] = useState(kudos.likeCount);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const isOwn = !!currentUserEmail && currentUserEmail === kudos.sender.email;
  const isAuthed = !!currentUserEmail;

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 2500);
  };

  const handleLike = async () => {
    if (!isAuthed) return showToast(t.loginRequired);
    if (isOwn) return;
    const nextLiked = !liked;
    const nextCount = likeCount + (nextLiked ? 1 : -1);
    setLiked(nextLiked);
    setLikeCount(nextCount);
    try {
      await apiFetch(`/kudos/${kudos.id}/like`, { method: nextLiked ? 'POST' : 'DELETE' });
    } catch {
      setLiked(!nextLiked);
      setLikeCount(likeCount);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/kudos/${kudos.id}`;
    await navigator.clipboard.writeText(url);
    showToast(t.copyLinkToast);
  };

  const safeMessageHtml = useMemo(() => sanitizeHtml(kudos.message ?? ''), [kudos.message]);

  return (
    <div
      className="flex flex-col gap-4 pt-6 px-6 pb-4"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      {/* Sender → ✈ → Receiver */}
      <div className="flex items-start justify-between gap-2 pr-10">
        <UserVerticalBlock {...kudos.sender} />
        <PaperPlaneIcon className="w-6 h-6 text-[#00101A] mt-5 shrink-0" />
        <UserVerticalBlock {...kudos.receiver} />
      </div>

      <hr className="border-0 h-px bg-[#FFEA9E]" />

      {/* Time */}
      <p className="text-sm font-bold text-[#999]">{formatKudosDate(kudos.createdAt)}</p>

      {/* Title */}
      {kudos.title && (
        <p className="text-base font-bold tracking-wide text-center text-[#00101A] uppercase">
          {kudos.title}
        </p>
      )}

      {/* Inner content box — FULL message, no line-clamp */}
      <div className="rounded-xl bg-[#FFF3C4] border border-[#FFEA9E]/60 px-4 py-3">
        <div
          className="w-full text-sm font-medium leading-relaxed text-[#00101A] whitespace-pre-wrap [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_a]:text-[#B8860B] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FFEA9E] [&_blockquote]:pl-3 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: safeMessageHtml }}
        />
      </div>

      {/* ALL images — full grid on detail (no slice) */}
      {kudos.imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {kudos.imageUrls.map((url, i) => (
            <div
              key={url + i}
              className="relative aspect-square rounded-md overflow-hidden bg-black/5"
            >
              <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Hashtags — full list (no slice/truncate on detail) */}
      {kudos.hashtags.length > 0 && (
        <p className="text-sm font-semibold text-[#E94F4F] flex flex-wrap gap-x-2">
          {kudos.hashtags.map((h) => <span key={h}>#{h}</span>)}
        </p>
      )}

      <hr className="border-0 h-px bg-[#FFEA9E]" />

      {/* Action row — Like + Copy Link only (no Xem chi tiết on detail) */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          disabled={isOwn}
          aria-label="Like"
          className={`flex items-center gap-2 transition-opacity ${
            isOwn ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
          }`}
        >
          <span className="text-2xl font-bold text-[#B8860B] tabular-nums">
            {numberFormatter.format(likeCount)}
          </span>
          <HeartIcon
            className={`w-6 h-6 transition-colors ${liked ? 'text-red-500' : 'text-red-400/70'}`}
            filled={liked}
          />
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-sm font-medium text-[#444] hover:text-[#B8860B] transition-colors"
        >
          <span>{t.copyLink}</span>
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      <KudosToast message={toast.msg} visible={toast.show} />
    </div>
  );
}
