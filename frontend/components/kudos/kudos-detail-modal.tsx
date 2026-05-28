'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KudosCard } from '@/lib/types/kudos';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { formatKudosDate } from '@/lib/format-date';
import { UserInfoBlock } from './user-info-block';
import { KudosActionBar } from './kudos-action-bar';

interface KudosDetailModalProps {
  id: string;
}

export function KudosDetailModal({ id }: KudosDetailModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const [kudos, setKudos] = useState<KudosCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserEmail(payload.email as string);
      } catch {
        // ignore
      }
    }
  }, []);

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
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
    >
      {/* Dialog card */}
      <div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1f33] shadow-2xl p-6 flex flex-col gap-4">

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label={t.closeDialog}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-colors"
        >
          ✕
        </button>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
          </div>
        )}

        {!loading && !kudos && (
          <p className="text-center text-white/40 py-12">Not found.</p>
        )}

        {kudos && (
          <>
            {/* Sender → Receiver */}
            <div className="flex items-center gap-4 flex-wrap pr-8">
              <UserInfoBlock {...kudos.sender} />
              <span className="text-[#FFEA9E] text-xl">→</span>
              <UserInfoBlock {...kudos.receiver} />
            </div>

            {/* Time */}
            <p className="text-xs text-white/40">{formatKudosDate(kudos.createdAt)}</p>

            <hr className="border-white/10" />

            {/* Full message */}
            <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
              {kudos.message}
            </p>

            {/* Hashtags */}
            {kudos.hashtags.length > 0 && (
              <p className="text-sm text-[#FFEA9E]/70">
                {kudos.hashtags.map((h) => `#${h}`).join(' ')}
              </p>
            )}

            <hr className="border-white/10" />

            <KudosActionBar
              kudosId={kudos.id}
              likeCount={kudos.likeCount}
              likedByMe={kudos.likedByMe}
              senderEmail={kudos.sender.email}
              currentUserEmail={currentUserEmail}
            />
          </>
        )}
      </div>
    </div>
  );
}
