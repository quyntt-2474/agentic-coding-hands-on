'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KudosStats } from '@/lib/types/kudos';
import { apiFetch } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

type Recipient = KudosStats['recentRecipients'][number];

export function SidebarRecipients() {
  const t = useTranslations();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // /kudos/stats is auth-only; use public kudos list to derive recent receivers for non-authed view
    // For simplicity, derive from GET /kudos (latest 10 receivers)
    apiFetch<{ data: Array<{ receiver: Recipient }> }>('/kudos?limit=10')
      .then((res) => {
        const seen = new Set<string>();
        const unique: Recipient[] = [];
        for (const item of res.data) {
          if (!seen.has(item.receiver.email)) {
            seen.add(item.receiver.email);
            unique.push(item.receiver);
          }
        }
        setRecipients(unique.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 className="text-xs font-bold text-[#FFEA9E] uppercase tracking-wider mb-3">
        {t.recentRecipients}
      </h3>

      {loading ? (
        <div className="flex justify-center py-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
        </div>
      ) : recipients.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-3">{t.kudosEmptyLeaderboard}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recipients.map((r) => (
            <li key={r.email}>
              <Link
                href={`/profile/${r.email}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {r.picture ? (
                  <Image
                    src={r.picture}
                    alt={r.name}
                    width={28}
                    height={28}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FFEA9E]/20 flex items-center justify-center text-[#FFEA9E] text-xs font-bold shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-bold text-white truncate">{r.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
