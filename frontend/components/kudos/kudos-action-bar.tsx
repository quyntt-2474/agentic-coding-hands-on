'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { KudosToast } from './kudos-toast';

interface KudosActionBarProps {
  kudosId: string;
  likeCount: number;
  likedByMe: boolean;
  senderEmail: string;
  currentUserEmail?: string;
  onLikeChange?: (id: string, liked: boolean, count: number) => void;
}

export function KudosActionBar({
  kudosId,
  likeCount,
  likedByMe,
  senderEmail,
  currentUserEmail,
  onLikeChange,
}: KudosActionBarProps) {
  const t = useTranslations();
  const router = useRouter();
  const [optimisticLiked, setOptimisticLiked] = useState(likedByMe);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const isOwn = !!currentUserEmail && currentUserEmail === senderEmail;
  const isAuthed = !!currentUserEmail;

  const showMessage = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLike = async () => {
    if (!isAuthed) { showMessage(t.loginRequired); return; }
    if (isOwn) return;

    const newLiked = !optimisticLiked;
    const newCount = newLiked ? optimisticCount + 1 : optimisticCount - 1;

    // Optimistic update
    setOptimisticLiked(newLiked);
    setOptimisticCount(newCount);
    onLikeChange?.(kudosId, newLiked, newCount);

    try {
      if (newLiked) {
        await apiFetch(`/kudos/${kudosId}/like`, { method: 'POST' });
      } else {
        await apiFetch(`/kudos/${kudosId}/like`, { method: 'DELETE' });
      }
    } catch {
      // Revert on error
      setOptimisticLiked(likedByMe);
      setOptimisticCount(likeCount);
      onLikeChange?.(kudosId, likedByMe, likeCount);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/kudos/${kudosId}`;
    await navigator.clipboard.writeText(url);
    showMessage(t.copyLinkToast);
  };

  const handleViewDetails = () => {
    router.push(`/kudos/${kudosId}`);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Like button */}
      <button
        onClick={handleLike}
        disabled={isOwn}
        className={`flex items-center gap-1.5 text-sm transition-colors ${
          isOwn
            ? 'opacity-30 cursor-not-allowed'
            : optimisticLiked
            ? 'text-red-400'
            : 'text-white/50 hover:text-red-400'
        }`}
        aria-label="Like"
      >
        <span>{optimisticLiked ? '❤️' : '🤍'}</span>
        <span>{optimisticCount}</span>
      </button>

      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        className="text-xs text-white/40 hover:text-white/80 transition-colors border border-white/15 rounded px-2 py-0.5"
      >
        🔗
      </button>

      {/* View details */}
      <button
        onClick={handleViewDetails}
        className="text-xs text-white/40 hover:text-[#FFEA9E] transition-colors"
      >
        {t.viewKudo}
      </button>

      <KudosToast message={toastMsg} visible={showToast} />
    </div>
  );
}
