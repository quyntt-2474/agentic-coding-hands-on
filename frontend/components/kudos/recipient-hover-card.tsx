'use client';

import Image from 'next/image';
import { RecipientProfile } from '@/lib/types/kudos';

interface RecipientHoverCardProps {
  /** Anchor position in viewport coordinates (e.g. event.clientX/Y of hovered name). */
  x: number;
  y: number;
  profile: RecipientProfile | null;
  /** True while the profile is being fetched — render skeleton in this state. */
  loading: boolean;
  /** Called when the user wants to send a kudo to this recipient. */
  onSendKudo: () => void;
  /** Mouse-enter/leave on the card itself, so the parent can cancel the hide timer. */
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CARD_WIDTH = 344;
const CARD_OFFSET_Y = 16;

/**
 * Floating profile card shown when hovering a name in the Spotlight word cloud.
 * Layout matches Figma node 2268-35101: avatar/name + department + badge +
 * received/sent counts + "Gửi KUDO" CTA. Renders via fixed positioning so it
 * survives the SVG pan/zoom transform of the parent board.
 */
export function RecipientHoverCard({
  x,
  y,
  profile,
  loading,
  onSendKudo,
  onMouseEnter,
  onMouseLeave,
}: RecipientHoverCardProps) {
  // Clamp horizontally so the card never overflows the viewport.
  const clampedX = clampInViewport(x - CARD_WIDTH / 2, CARD_WIDTH);
  const top = y + CARD_OFFSET_Y;

  return (
    <div
      className="fixed z-[60] rounded-2xl border border-white/10 bg-[#0B1116] shadow-[0_18px_48px_rgba(0,0,0,0.6)]
                 p-5 font-[family-name:var(--font-montserrat)] text-white"
      style={{ left: clampedX, top, width: CARD_WIDTH }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loading || !profile ? <SkeletonCard /> : <ProfileBody profile={profile} onSendKudo={onSendKudo} />}
    </div>
  );
}

function ProfileBody({
  profile,
  onSendKudo,
}: {
  profile: RecipientProfile;
  onSendKudo: () => void;
}) {
  return (
    <>
      <div className="flex items-start gap-3">
        <Avatar profile={profile} size={48} />
        <div className="flex-1 min-w-0">
          <h4 className="text-[20px] font-bold text-[#FFEA9E] leading-tight truncate">
            {profile.name}
          </h4>
          {profile.department && (
            <p className="mt-1 text-[13px] leading-snug text-white/80 line-clamp-2">
              <span className="text-white/60">Tên đơn vị: </span>
              {profile.department}
            </p>
          )}
        </div>
      </div>

      <BadgeChip label={profile.badge} className="mt-4" />

      <div className="my-4 h-px bg-white/10" />

      <div className="space-y-2 text-[14px]">
        <StatRow label="Số Kudos nhận được:" value={profile.kudosReceived} />
        <StatRow label="Số Kudos đã gửi:" value={profile.kudosSent} />
      </div>

      <button
        type="button"
        onClick={onSendKudo}
        className="mt-5 w-full h-11 rounded-xl bg-[#FFEA9E] hover:bg-[#FFE079] active:bg-[#F5D267]
                   text-[#00101A] font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
      >
        <PencilIcon />
        Gửi KUDO
      </button>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70">{label}</span>
      <span className="font-bold text-[#FFEA9E] text-[16px]">{value}</span>
    </div>
  );
}

function BadgeChip({ label, className = '' }: { label: string; className?: string }) {
  // Gold-gradient pill, matches the "Legend Hero" treatment in the design.
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 h-9 rounded-full
                  bg-gradient-to-r from-[#3A2A0E] via-[#8C6A1F] to-[#3A2A0E]
                  border border-[#E0B96A]/60 shadow-[0_2px_8px_rgba(255,234,158,0.25)] ${className}`}
    >
      <span className="text-[15px] font-extrabold text-[#FFEA9E] tracking-wide">{label}</span>
    </div>
  );
}

function Avatar({ profile, size }: { profile: RecipientProfile; size: number }) {
  if (profile.picture) {
    return (
      <Image
        src={profile.picture}
        alt={profile.name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0 border border-white/15"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-[#FFEA9E] text-[#00101A] font-bold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {profile.name.charAt(0).toUpperCase()}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/10" />
        </div>
      </div>
      <div className="h-9 w-32 rounded-full bg-white/10" />
      <div className="h-px bg-white/10" />
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="h-11 w-full rounded-xl bg-white/10" />
    </div>
  );
}

function clampInViewport(left: number, width: number): number {
  if (typeof window === 'undefined') return left;
  const padding = 12;
  const max = window.innerWidth - width - padding;
  return Math.max(padding, Math.min(left, max));
}
