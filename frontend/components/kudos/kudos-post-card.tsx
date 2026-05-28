import { KudosCard } from '@/lib/types/kudos';
import { formatKudosDate } from '@/lib/format-date';
import { UserInfoBlock } from './user-info-block';
import { KudosActionBar } from './kudos-action-bar';

interface KudosPostCardProps {
  kudos: KudosCard;
  currentUserEmail?: string;
  onLikeChange?: (id: string, liked: boolean, count: number) => void;
}

export function KudosPostCard({ kudos, currentUserEmail, onLikeChange }: KudosPostCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
      {/* Sender → Receiver */}
      <div className="flex items-center gap-3 flex-wrap">
        <UserInfoBlock {...kudos.sender} size="sm" />
        <span className="text-[#FFEA9E]">→</span>
        <UserInfoBlock {...kudos.receiver} size="sm" />
      </div>

      {/* Time */}
      <p className="text-xs text-white/35">{formatKudosDate(kudos.createdAt)}</p>

      {/* Message */}
      <p className="text-sm text-white/80 leading-relaxed line-clamp-5">
        {kudos.message}
      </p>

      {/* Hashtags */}
      {kudos.hashtags.length > 0 && (
        <p className="text-xs text-[#FFEA9E]/60">
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
        onLikeChange={onLikeChange}
      />
    </article>
  );
}
