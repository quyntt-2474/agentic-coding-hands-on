import Image from 'next/image';
import Link from 'next/link';

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
      <Link href={`/profile/${email}`} className="shrink-0">
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
          href={`/profile/${email}`}
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
