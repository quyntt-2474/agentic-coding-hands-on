"use client";

import Image from "next/image";
import { useTranslations } from "@/lib/i18n";
import { KudosInputTrigger } from "./kudos-input-trigger";

/** Hero section — matches Figma split layout:
 *  left  ~55%: subtitle + KUDOS logo (dark bg)
 *  right ~45%: key-visual decorative art, cropped from left edge
 */
function KudosHeroInner() {
  const t = useTranslations();
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ background: "var(--background)", minHeight: 512 }}
    >
      {/* Key-visual background — full-width centered, no opacity (Figma: 1440×512px) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url(/key-visual.png)" }}
        aria-hidden="true"
      />

      {/* Diagonal gradient overlay — 25deg, dark bottom-left fade (Figma: Cover node) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)",
        }}
        aria-hidden="true"
      />

      {/* Left content: subtitle (italic gold) + KUDOS logo */}
      <div className="relative z-10 max-w-6xl mx-40 px-6 md:px-10 pt-[144px] pb-6">
        <div className="flex flex-col gap-2 md:gap-3 max-w-[480px]">
          <p className="text-3xl font-bold text-[#FFEA9E]
                        font-[family-name:var(--font-montserrat)] leading-snug">
            {t.kudosLiveTitle}
          </p>
          <Image
            src="/icons/kudos-logo.svg"
            alt="SAA 2025 Kudos"
            width={450}
            height={100}
            className="max-w-[220px] md:max-w-[600px]"
            priority
          />
        </div>
      </div>
      {/* Input trigger — mt-auto pushes to bottom of hero, z-10 above overlays */}
      <div className="relative z-10 mt-auto">
        <KudosInputTrigger />
      </div>
    </section>
  );
}

export function KudosHero() {
  return <KudosHeroInner />;
}
