'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KudosCard } from '@/lib/types/kudos';
import { formatKudosDate } from '@/lib/format-date';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { KudosToast } from './kudos-toast';
import { UserVerticalBlock } from './user-info-block';
import { PaperPlaneIcon, HeartIcon, LinkIcon, ArrowUpRightIcon } from './kudos-icons';

interface HighlightKudosCardProps {
  kudos: KudosCard;
  currentUserEmail?: string;
}

const numberFormatter = new Intl.NumberFormat('vi-VN');

/**
 * Highlight kudos card — Figma node 1764:5008 / 1764:5014 (master via 335:9620).
 * Cream card with vertical sender→receiver header, inner content box,
 * image gallery row, large like count, and a single Copy Link action.
 */
export function HighlightKudosCard({ kudos, currentUserEmail }: HighlightKudosCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  // Controlled by props — local optimistic updates flow via the `kudos:liked`
  // window event so the parent's array updates and this card (plus any other
  // card showing the same kudos) re-renders instantly.
  const liked = kudos.likedByMe;
  const likeCount = kudos.likeCount;
  const isAuthed = !!currentUserEmail;

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 2500);
  };

  const emitLikeChange = (likedNext: boolean, countNext: number) => {
    window.dispatchEvent(
      new CustomEvent('kudos:liked', {
        detail: { id: kudos.id, likedByMe: likedNext, likeCount: countNext },
      }),
    );
  };

  const handleLike = async () => {
    if (!isAuthed) return showToast(t.loginRequired);
    const next = !liked;
    const nextCount = likeCount + (next ? 1 : -1);
    emitLikeChange(next, nextCount);
    try {
      await apiFetch(`/kudos/${kudos.id}/like`, { method: next ? 'POST' : 'DELETE' });
    } catch {
      emitLikeChange(liked, likeCount);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/kudos/${kudos.id}`;
    await navigator.clipboard.writeText(url);
    showToast(t.copyLinkToast);
  };

  const images = kudos.imageUrls.slice(0, 5);
  const safeMessageHtml = useMemo(() => sanitizeHtml(kudos.message ?? ''), [kudos.message]);

  return (
    <div
      className="h-full flex flex-col gap-4 rounded-2xl bg-[#FFF8E1] border-4 border-[#FFEA9E] pt-6 px-6 pb-4 shadow-lg"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      {/* Sender → ✈ → Receiver — vertical stacks + paper plane in middle */}
      <div className="flex items-start justify-between gap-2">
        <UserVerticalBlock {...kudos.sender} />
        <PaperPlaneIcon className="w-6 h-6 text-[#00101A] mt-5 shrink-0" />
        <UserVerticalBlock {...kudos.receiver} />
      </div>

      {/* Gold divider */}
      <hr className="border-0 h-px bg-[#FFEA9E]" />

      {/* Time — left aligned, gray */}
      <p className="text-sm font-bold text-[#999]">{formatKudosDate(kudos.createdAt)}</p>

      {/* Title (danh hiệu) — centered, dark, uppercase */}
      {kudos.title && (
        <p className="text-base font-bold tracking-wide text-center text-[#00101A] uppercase">
          {kudos.title}
        </p>
      )}

      {/* Inner content box — slightly darker cream.
          min-height kept around 1/3 of typical card width so short messages
          don't collapse the card; long messages truncate via line-clamp + ... */}
      <div
        className="rounded-xl bg-[#FFF3C4] border border-[#FFEA9E]/60 px-4 py-3 flex items-start"
      >
        <div
          className="w-full text-sm font-medium leading-relaxed text-[#00101A] line-clamp-4 [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_a]:text-[#B8860B] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FFEA9E] [&_blockquote]:pl-3 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: safeMessageHtml }}
        />
      </div>

      {/* Image gallery — up to 5 thumbnails in a row */}
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.map((url, i) => (
            <div
              key={url + i}
              className="relative w-[18%] aspect-square rounded-md overflow-hidden bg-black/5"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Hashtags — coral red, single line truncate, max 5 */}
      {kudos.hashtags.length > 0 && (
        <p className="text-sm font-semibold text-[#E94F4F] truncate">
          {kudos.hashtags.slice(0, 5).map((h) => `#${h}`).join(' ')}
          {kudos.hashtags.length > 5 && '...'}
        </p>
      )}

      {/* Gold divider */}
      <hr className="border-0 h-px bg-[#FFEA9E]" />

      {/* Action row — large like count on left, Copy Link on right */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          aria-label="Like"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-2xl font-bold text-[#B8860B] tabular-nums">
            {numberFormatter.format(likeCount)}
          </span>
          <HeartIcon
            className={`w-6 h-6 transition-colors ${liked ? 'text-red-500' : 'text-red-400/70'}`}
            filled={liked}
          />
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-sm font-medium text-[#444] hover:text-[#B8860B] transition-colors"
          >
            <span>{t.copyLink}</span>
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push(`/kudos/${kudos.id}`)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#444] hover:text-[#B8860B] transition-colors"
          >
            <span>{t.viewKudo}</span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <KudosToast message={toast.msg} visible={toast.show} />
    </div>
  );
}

