"use client";

import { useTranslations } from "@/lib/i18n";

const ICON_COUNT = 6;

/**
 * Section A (lower) — "Bộ sưu tập icon của tôi".
 * Hardcoded 6 gray placeholder circles. No data/logic this iteration.
 */
export function ProfileIconCollection() {
  const t = useTranslations();

  return (
    <div className="px-4 py-6 flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: ICON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-white/10 border border-white shrink-0"
            aria-hidden="true"
          />
        ))}
      </div>

      <p
        className="text-sm font-bold text-white/70 text-center"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {t.profileMyIconCollection}
      </p>
    </div>
  );
}
