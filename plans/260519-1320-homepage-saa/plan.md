# Homepage SAA — Implementation Plan

**Status:** In Progress  
**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM  
**Clarifications:** `./clarifications.md`

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 01 | Design tokens + global styles | ✅ |
| 02 | Layout + Header component | ✅ |
| 03 | Hero / Keyvisual section (countdown, CTA) | ✅ |
| 04 | Awards section (C1 header + C2 cards grid) | ✅ |
| 05 | Sun* Kudos section | ✅ |
| 06 | Widget button + Footer | ✅ |
| 07 | Root page.tsx wiring + auth-aware header | ✅ |

## Design Tokens

- Background: `#0a1628`
- Gold accent: `#FFEA9E`
- White text: `#ffffff`
- Section divider: `#2e3940`
- Font: `Montserrat 700` (already loaded in layout.tsx)
- Heading 57px / lh 64px (section titles)
- Body labels 24px / lh 32px

## Key Files

**Modify:**
- `frontend/app/page.tsx` — full replacement
- `frontend/app/globals.css` — add SAA theme vars
- `frontend/app/layout.tsx` — wrap with LanguageProvider
- `frontend/.env.example` — add NEXT_PUBLIC_EVENT_DATETIME
- `frontend/.env.local` — add NEXT_PUBLIC_EVENT_DATETIME

**Create:**
- `frontend/components/homepage/header.tsx`
- `frontend/components/homepage/hero-section.tsx`
- `frontend/components/homepage/countdown-timer.tsx`
- `frontend/components/homepage/awards-section.tsx`
- `frontend/components/homepage/award-card.tsx`
- `frontend/components/homepage/kudos-section.tsx`
- `frontend/components/homepage/widget-button.tsx`
- `frontend/components/homepage/site-footer.tsx`

**Media to download:**
- Award card images (6x): Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 Creator, MVP
- Kudos background
- Award card background (shared)

## Nav Routes
- About SAA 2025 → `/` (home scroll top)
- Awards Information → `/awards`
- Sun* Kudos → `/kudos`
- Tiêu chuẩn chung → `/general-standards`

## Notes
- Homepage is public (no auth guard)
- Auth users see: notification bell, user avatar in header
- Non-auth users see: same header without notification/avatar
- Widget button: visual only, no click action
- Countdown env var: `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601)
- Award cards: 3-col desktop, 2-col tablet/mobile
- Click award card → `/awards#<slug>`
