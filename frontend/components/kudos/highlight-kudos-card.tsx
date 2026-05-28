import { KudosCard } from '@/lib/types/kudos';
import { formatKudosDate } from '@/lib/format-date';
import { UserInfoBlock } from './user-info-block';

interface HighlightKudosCardProps {
  kudos: KudosCard;
}

export function HighlightKudosCard({ kudos }: HighlightKudosCardProps) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3">
      {/* Sender → Receiver */}
      <div className="flex items-center gap-3 flex-wrap">
        <UserInfoBlock {...kudos.sender} size="sm" />
        <span className="text-[#FFEA9E] text-lg">→</span>
        <UserInfoBlock {...kudos.receiver} size="sm" />
      </div>

      {/* Time */}
      <p className="text-xs text-white/40">{formatKudosDate(kudos.createdAt)}</p>

      <hr className="border-white/10" />

      {/* Message */}
      <p className="text-sm text-white/80 leading-relaxed line-clamp-3 flex-1">
        {kudos.message}
      </p>

      {/* Hashtags */}
      {kudos.hashtags.length > 0 && (
        <p className="text-xs text-[#FFEA9E]/70 truncate">
          {kudos.hashtags.map((h) => `#${h}`).join(' ')}
        </p>
      )}

      <hr className="border-white/10" />

      {/* Like count */}
      <div className="flex items-center gap-1.5 text-sm text-white/60">
        <span>❤️</span>
        <span>{kudos.likeCount}</span>
      </div>
    </div>
  );
}
