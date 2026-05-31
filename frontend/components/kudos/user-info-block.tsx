import Image from 'next/image';
import Link from 'next/link';

/** Rank label derived from stars per momorph spec B.3.2 (10/20/50 kudos thresholds). */
export function rankLabel(stars: number): string | null {
  if (stars >= 3) return 'Legend Hero';
  if (stars >= 2) return 'Rising Hero';
  if (stars >= 1) return 'Warm Spreader';
  return null;
}

interface UserVerticalBlockProps {
  email: string;
  name: string;
  picture: string;
  department: string;
  stars: number;
  avatarSize?: number;
}

/** Vertical user block (avatar / name / dept-rank pill) used on cream kudos cards. */
export function UserVerticalBlock({
  name,
  picture,
  department,
  stars,
  avatarSize = 56,
}: UserVerticalBlockProps) {
  const rank = rankLabel(stars);
  return (
    <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
      <div className="shrink-0">
        {picture ? (
          <Image
            src={picture}
            alt={name}
            width={avatarSize}
            height={avatarSize}
            className="rounded-full object-cover border-2 border-white shadow-sm"
            style={{ width: avatarSize, height: avatarSize }}
          />
        ) : (
          <div
            className="rounded-full bg-[#FFEA9E] flex items-center justify-center text-[#00101A] font-bold border-2 border-white shadow-sm"
            style={{ width: avatarSize, height: avatarSize, fontSize: avatarSize * 0.36 }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-sm font-bold text-[#00101A] truncate max-w-full text-center">
        {name}
      </span>
      <span className="text-[10px] font-semibold text-[#00101A] bg-[#FFEA9E] rounded-full px-2 py-0.5 truncate max-w-full">
        {department}
        {rank && ` • ${rank}`}
      </span>
    </div>
  );
}

interface UserInfoBlockProps {
  email: string;
  name: string;
  picture: string;
  department: string;
  stars: number;
  size?: 'sm' | 'md';
}

export function UserInfoBlock({
  email,
  name,
  picture,
  department,
  stars,
  size = 'md',
}: UserInfoBlockProps) {
  const avatarSize = size === 'sm' ? 32 : 40;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <Link href={`/profile/${encodeURIComponent(email)}`} className="shrink-0">
        {picture ? (
          <Image
            src={picture}
            alt={name}
            width={avatarSize}
            height={avatarSize}
            className="rounded-full object-cover"
            style={{ width: avatarSize, height: avatarSize }}
          />
        ) : (
          <div
            className="rounded-full bg-[#FFEA9E]/20 flex items-center justify-center text-[#FFEA9E] font-bold"
            style={{ width: avatarSize, height: avatarSize, fontSize: avatarSize * 0.4 }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <Link
          href={`/profile/${encodeURIComponent(email)}`}
          className={`${textSize} font-semibold text-white hover:text-[#FFEA9E] transition-colors truncate`}
        >
          {name}
        </Link>
        {department && (
          <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-white/50 truncate`}>
            {department}
          </span>
        )}
        {stars > 0 && (
          <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-[#FFEA9E]`}>
            {'★'.repeat(Math.min(stars, 5))}
          </span>
        )}
      </div>
    </div>
  );
}
