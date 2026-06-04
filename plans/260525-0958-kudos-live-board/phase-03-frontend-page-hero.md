# Phase 03 — Frontend: /kudos Page Scaffold + KV Hero + Input Trigger

**Priority:** High
**Status:** ✅ Done
**Effort:** ~1.5h
**Can start in parallel with:** Phase 02

## Context
- Next.js 16.2.6, React 19, Tailwind CSS 4, TypeScript
- Pattern: page file at `frontend/app/kudos/page.tsx`
- SiteHeader/SiteFooter/WidgetButton already exist
- Design: dark `#0a1628` background, Montserrat font, gold `#FFEA9E` accents
- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ

## Sections in This Phase
- **A — KV Kudos Banner**: hero with title + SAA 2025 KUDOS logo (readonly)
- **A.1 — Input trigger**: pill-shaped input with pencil icon → clicking shows "coming soon" toast

## Design Specs (from MoMorph A / A.1)

### KV Banner (A)
- Full-width section, dark decorative background graphic
- Title: `'Hệ thống ghi nhận lời cảm ơn'` — large bold Montserrat, white, prominent
- Below title: SAA 2025 KUDOS logo (`/icons/kudos-logo.svg` already in public)
- Readonly — no interactions

### Input Trigger (A.1)
- Pill-shaped text field (rounded-full), light border on dark bg
- Left: pencil icon (`/icons/icon-pencil.svg` — may need to add)
- Placeholder: `'Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?'`
- Width: max ~720px, centered
- On click → show toast: `'Chức năng đang phát triển'` (feature coming soon)
- Required: true per spec, but no form submission (dialog out of scope)

## Architecture

```
frontend/app/kudos/
└── page.tsx                  ← new page file

frontend/components/kudos/
├── kudos-hero.tsx            ← KV banner (A)
├── kudos-input-trigger.tsx   ← pill input trigger (A.1)
└── kudos-toast.tsx           ← simple toast notification
```

`frontend/app/kudos/page.tsx` composes:
```tsx
<SiteHeader currentPath="/kudos" />
<main>
  <KudosHero />
  <KudosInputTrigger />
  {/* Phase 04: <HighlightSection /> */}
  {/* Phase 06: <SpotlightSection /> */}
  {/* Phase 05: <AllKudosFeed /> + <KudosSidebar /> */}
</main>
<SiteFooter />
<WidgetButton />
```

## Implementation Steps

1. Create `frontend/app/kudos/page.tsx` with page scaffold (SiteHeader + main + SiteFooter + WidgetButton)
2. Create `frontend/components/kudos/kudos-hero.tsx`:
   - Full-width dark section with decorative bg
   - Centered title text + kudos-logo.svg below
3. Create `frontend/components/kudos/kudos-input-trigger.tsx`:
   - `'use client'` — needs onClick state
   - Pill input div (not real `<input>` — it's a trigger, not a form field)
   - Click handler sets `showToast = true`, auto-dismiss after 3s
4. Create `frontend/components/kudos/kudos-toast.tsx`:
   - Fixed bottom-center toast, fade in/out animation via Tailwind
   - Accept `message` prop + `visible` boolean
5. Add pencil icon SVG to `frontend/public/icons/icon-pencil.svg` if not present
6. Run `npm run build` / `npm run dev` to verify no compile errors

## Related Code Files

**Create:**
- `frontend/app/kudos/page.tsx`
- `frontend/components/kudos/kudos-hero.tsx`
- `frontend/components/kudos/kudos-input-trigger.tsx`
- `frontend/components/kudos/kudos-toast.tsx`

**Modify:**
- `frontend/lib/i18n.ts` — add kudos page i18n keys (see Phase 07 for full list; add placeholder keys now)
- `frontend/public/icons/icon-pencil.svg` — add if missing

## Todo
- [x] Create `frontend/app/kudos/page.tsx`
- [x] Create `kudos-hero.tsx` with title + logo
- [x] Create `kudos-input-trigger.tsx` with pill input + toast trigger
- [x] Create `kudos-toast.tsx`
- [x] Verify pencil icon exists or add SVG
- [x] Compile check (`npm run build`)

## Success Criteria
- `/kudos` route renders without error
- Hero banner shows title and SAA 2025 KUDOS logo
- Clicking the pill input shows "Chức năng đang phát triển" toast
- Toast auto-dismisses after 3s
- Page uses SiteHeader with `currentPath="/kudos"` (nav item highlighted)

## Notes
- Keep page.tsx under 30 lines — all sections are separate components
- `kudos-toast.tsx` will be reused in Phase 05 (copy link toast)
