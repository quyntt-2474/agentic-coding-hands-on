'use client';

import { use, useEffect, useState, useSyncExternalStore } from 'react';
import { SiteHeader } from '@/components/homepage/site-header';
import { SiteFooter } from '@/components/homepage/site-footer';
import { ProfileHero } from '@/components/profile/profile-hero';
import { ProfileIconCollection } from '@/components/profile/profile-icon-collection';
import { ProfileStatsBox } from '@/components/profile/profile-stats-box';
import { ProfileKudosSection } from '@/components/profile/profile-kudos-section';
import { apiFetch } from '@/lib/api';
import {
  getAuthUserServerSnapshot,
  getAuthUserSnapshot,
  subscribeAuthUser,
} from '@/lib/jwt';
import { KudosUser } from '@/lib/types/kudos';

interface ProfileApiResponse {
  user: KudosUser;
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
}

// Next.js 16: params is a Promise — must be unwrapped with `use()`.
export default function ProfilePage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: rawEmail } = use(params);
  // Emails contain '@' and '.' — the URL segment is encoded, so decode it.
  const email = decodeURIComponent(rawEmail);

  const authUser = useSyncExternalStore(
    subscribeAuthUser,
    getAuthUserSnapshot,
    getAuthUserServerSnapshot,
  );

  const [profile, setProfile] = useState<ProfileApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    apiFetch<ProfileApiResponse>(`/kudos/profile/${encodeURIComponent(email)}`)
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err: unknown) => {
        if (!ignore)
          setError(err instanceof Error ? err.message : 'Failed to load profile');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [email]);

  return (
    <>
      <SiteHeader currentPath="/profile" />

      <main
        className="flex flex-col min-h-screen bg-[var(--background)] pt-[72px]"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 rounded-full border-2 border-[#FFEA9E]/30 border-t-[#FFEA9E] animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="flex justify-center items-center py-32">
            <p className="text-white/40 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="max-w-2xl mx-auto w-full pb-12">
            {/* Section A — hero banner + avatar + name + rank */}
            <ProfileHero
              name={profile.user.name}
              picture={profile.user.picture}
              department={profile.user.department}
              stars={profile.user.stars}
            />

            {/* Section A (lower) — icon collection */}
            <ProfileIconCollection />

            {/* Section B — stats box */}
            <ProfileStatsBox
              kudosReceived={profile.kudosReceived}
              kudosSent={profile.kudosSent}
              heartsReceived={profile.heartsReceived}
            />

            {/* Sections C + D — awards header + kudos feed */}
            <ProfileKudosSection
              email={email}
              currentUserEmail={authUser?.email}
            />
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
