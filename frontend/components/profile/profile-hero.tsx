'use client';

import Image from 'next/image';
import { rankLabel } from '@/components/kudos/user-info-block';

interface ProfileHeroProps {
  name: string;
  picture: string;
  department: string;
  stars: number;
}

/**
 * Section A — profile hero: colorful key-visual banner behind a large circular
 * avatar, display name, and a rank badge pill below the name.
 */
export function ProfileHero({ name, picture, department, stars }: ProfileHeroProps) {
  const rank = rankLabel(stars);
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative w-full">
      {/* Key-visual banner — full-bleed to 100vw, escaping the centered
          max-w container so the background spans the whole screen width.
          Content (avatar / name / rank) is centered on top of the artwork. */}
      <div className="relative h-72 w-screen left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
        {/* Background image — full-width centered, no opacity (matches kudos-hero) */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: 'url(/key-visual.png)' }}
          aria-hidden="true"
        />

        {/* Diagonal gradient overlay — 25deg, dark bottom-left fade (Figma: Cover node) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)',
          }}
          aria-hidden="true"
        />

        {/* Vertical bottom fade — blends the banner into the dark page below */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 16, 26, 0.00) 55%, #00101A 100%)',
          }}
          aria-hidden="true"
        />

        {/* Centered overlay content */}
        <div className="relative z-10 flex flex-col items-center px-6">
          {/* Avatar — large circle with light ring */}
          <div className="rounded-full border-4 border-white shadow-xl bg-[#00101A] shrink-0">
            {picture ? (
              <Image
                src={picture}
                alt={name}
                width={140}
                height={140}
                className="rounded-full object-cover"
                style={{ width: 140, height: 140 }}
                unoptimized
              />
            ) : (
              <div
                className="rounded-full bg-[#FFEA9E] flex items-center justify-center text-[#00101A] font-bold text-5xl"
                style={{ width: 140, height: 140 }}
              >
                {initial}
              </div>
            )}
          </div>

          {/* Name — large gold heading */}
          <h1
            className="mt-4 text-3xl font-bold text-[#FFEA9E] text-center drop-shadow"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {name}
          </h1>

          {/* Dept · rank badge — single inline row */}
          <div className="mt-2 flex items-center gap-2">
            {department && (
              <span
                className="text-sm font-semibold tracking-wide text-white"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {department}
              </span>
            )}
            {department && rank && (
              <span className="text-white/60" aria-hidden="true">
                •
              </span>
            )}
            {rank && (
              <span
                className="text-xs font-bold text-[#00101A] rounded-full px-3 py-1 shadow-sm border border-[#C9A227]"
                style={{
                  background:
                    'linear-gradient(180deg, #FFE9A0 0%, #F5C645 100%)',
                  fontFamily: 'var(--font-montserrat)',
                }}
              >
                {rank}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
