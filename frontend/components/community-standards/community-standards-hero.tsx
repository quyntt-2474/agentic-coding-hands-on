'use client';

import Image from 'next/image';

export function CommunityStandardsHero() {
  return (
    <div className="relative bg-[#00101a] overflow-hidden pt-[72px]">
      {/* Keyvisual background */}
      <div className="absolute inset-0 top-[72px] h-[400px]">
        <Image
          src="/key-visual.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay — dark at bottom */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(0deg, #00101a -4.23%, rgba(0,19,32,0) 52.79%)' }}
      />

      {/* Root Further logo */}
      <div className="relative z-10 w-full px-6 md:px-20 xl:px-36 pt-16 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-[240px] xl:w-[338px] h-[107px] xl:h-[150px]">
            <Image
              src="/root-further-hero.png"
              alt="ROOT FURTHER"
              fill
              priority
              className="object-contain object-left"
              sizes="338px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
