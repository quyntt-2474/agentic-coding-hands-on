"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import { FilterDropdown } from "./filter-dropdown";
import { KudosFeed } from "./kudos-feed";
import { KudosSidebar } from "./kudos-sidebar";

interface Hashtag {
  id: number;
  name: string;
}

export function AllKudosSection() {
  const t = useTranslations();
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<
    string | undefined
  >();

  useEffect(() => {
    // Derive current user email from JWT payload in localStorage
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserEmail(payload.email as string);
      } catch {
        // malformed token — ignore
      }
    }

    Promise.all([
      apiFetch<Hashtag[]>("/hashtags"),
      apiFetch<string[]>("/departments"),
    ])
      .then(([tags, depts]) => {
        setHashtags(tags.map((tag) => tag.name));
        setDepartments(depts);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <p
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Sun* Annual Awards 2025
      </p>

      {/* Divider — between subtitle and title+buttons (Figma node 2940:13455) */}
      <div className="h-px bg-[#2e3940] mt-4 mb-4" />

      {/* Title + filters row: space-between, center-aligned — Figma node 2940:13456 */}
      <div className="flex items-center justify-between gap-8 mb-6 flex-wrap">
        {/* Title: 57px bold gold, tracking -0.25px — Figma node 2940:13457 */}
        <h2
          className="text-[57px] font-bold text-[#FFEA9E] leading-[64px] tracking-[-0.25px]"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.allKudosTitle}
        </h2>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <KudosFeed
          activeHashtag={activeHashtag}
          activeDept={activeDept}
          currentUserEmail={currentUserEmail}
        />
        <KudosSidebar />
      </div>
    </section>
  );
}
