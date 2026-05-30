'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

interface AwardCardProps {
  slug: string;
  title: string;
  description: string;
  nameImage: string;
}

export function AwardCard({ slug, title, description, nameImage }: AwardCardProps) {
  const t = useTranslations();

  return (
    <Link href={`/awards#${slug}`} className="group flex flex-col gap-4">
      {/* Award badge image (dark bg + glow built-in) */}
      <div className="relative aspect-square rounded-2xl overflow-hidden">
        <Image
          src="/awards/award-card-bg.png"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={nameImage}
            alt={title}
            width={220}
            height={80}
            className="object-contain group-hover:scale-105 transition-transform duration-300 w-auto h-auto max-w-[220px] max-h-[80px]"
          />
        </div>
      </div>

      {/* Text content below image */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-[18px] font-bold font-[family-name:var(--font-montserrat)] text-saa-gold leading-snug">
          {title}
        </h3>
        <p className="text-[14px] font-[family-name:var(--font-montserrat)] text-white/70 leading-relaxed line-clamp-2">
          {description}
        </p>
        <span className="inline-flex items-center gap-1 mt-1 text-[14px] font-[family-name:var(--font-montserrat)] text-white group-hover:text-saa-gold transition-colors">
          {t.details}
          <Image src="/icons/icon-arrow-up-right.svg" alt="" width={14} height={14} style={{ width: 14, height: 14 }} />
        </span>
      </div>
    </Link>
  );
}
