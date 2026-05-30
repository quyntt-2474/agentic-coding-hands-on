"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { KudosCard } from "@/lib/types/kudos";
import { formatKudosDate } from "@/lib/format-date";
import { apiFetch } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { KudosToast } from "./kudos-toast";
import { UserVerticalBlock } from "./user-info-block";
import { PaperPlaneIcon, HeartIcon, LinkIcon } from "./kudos-icons";

interface KudosPostCardProps {
  kudos: KudosCard;
  currentUserEmail?: string;
  onLikeChange?: (id: string, liked: boolean, count: number) => void;
}

const numberFormatter = new Intl.NumberFormat("vi-VN");

/**
 * ALL KUDOS feed card — visual content matches the highlight card (cream BG,
 * gold border, vertical sender→✈→receiver header, inner content box, gallery,
 * large like count, Copy Link). The card does not navigate to a detail page.
 */
export function KudosPostCard({
  kudos,
  currentUserEmail,
  onLikeChange,
}: KudosPostCardProps) {
  const t = useTranslations();
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({
    msg: "",
    show: false,
  });

  // Controlled by props — like updates flow via the `kudos:liked` window event
  // (parent listener updates its kudos array; this card re-renders with new props).
  const liked = kudos.likedByMe;
  const likeCount = kudos.likeCount;
  const isAuthed = !!currentUserEmail;

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 2500);
  };

  const emitLikeChange = (likedNext: boolean, countNext: number) => {
    window.dispatchEvent(
      new CustomEvent("kudos:liked", {
        detail: { id: kudos.id, likedByMe: likedNext, likeCount: countNext },
      }),
    );
    onLikeChange?.(kudos.id, likedNext, countNext);
  };

  const handleLike = async () => {
    if (!isAuthed) return showToast(t.loginRequired);
    const nextLiked = !liked;
    const nextCount = likeCount + (nextLiked ? 1 : -1);
    emitLikeChange(nextLiked, nextCount);
    try {
      await apiFetch(`/kudos/${kudos.id}/like`, {
        method: nextLiked ? "POST" : "DELETE",
      });
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
  const safeMessageHtml = useMemo(
    () => sanitizeHtml(kudos.message ?? ""),
    [kudos.message],
  );

  return (
    <article
      className="relative rounded-2xl bg-[#FFF8E1] border-4 border-[#FFEA9E] pt-6 px-6 pb-4 shadow-lg flex flex-col gap-4"
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      {/* Sender → ✈ → Receiver */}
      <div className="flex items-start justify-between gap-2">
        <UserVerticalBlock {...kudos.sender} />
        <PaperPlaneIcon className="w-6 h-6 text-[#00101A] mt-5 shrink-0" />
        <UserVerticalBlock {...kudos.receiver} />
      </div>

      {/* Gold divider */}
      <hr className="border-0 h-px bg-[#FFEA9E]" />

      {/* Time */}
      <p className="text-sm font-bold text-[#999]">
        {formatKudosDate(kudos.createdAt)}
      </p>

      {/* Title (danh hiệu) */}
      {kudos.title && (
        <p className="text-base font-bold tracking-wide text-center text-[#00101A] uppercase">
          {kudos.title}
        </p>
      )}

      {/* Inner content box — line-clamp-6 gives more room than carousel (4) */}
      <div className="rounded-xl bg-[#FFF3C4] border border-[#FFEA9E]/60 px-4 py-3 flex items-start">
        <div
          className="w-full text-sm font-medium leading-relaxed text-[#00101A] line-clamp-6 [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_a]:text-[#B8860B] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FFEA9E] [&_blockquote]:pl-3 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: safeMessageHtml }}
        />
      </div>

      {/* Image gallery — up to 5 thumbnails */}
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

      {/* Hashtags */}
      {kudos.hashtags.length > 0 && (
        <p className="text-sm font-semibold text-[#E94F4F] truncate">
          {kudos.hashtags
            .slice(0, 5)
            .map((h) => `#${h}`)
            .join(" ")}
          {kudos.hashtags.length > 5 && "..."}
        </p>
      )}

      <hr className="border-0 h-px bg-[#FFEA9E]" />

      {/* Action row */}
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
            className={`w-6 h-6 transition-colors ${liked ? "text-red-500" : "text-red-400/70"}`}
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
    </article>
  );
}
