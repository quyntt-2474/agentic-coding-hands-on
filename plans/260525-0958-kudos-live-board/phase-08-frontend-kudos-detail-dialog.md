# Phase 08 — Frontend: Kudos Detail Dialog (`/kudos/[id]`)

**Priority:** Medium
**Status:** ✅ Done
**Effort:** ~2h
**Blocked by:** Phase 05 (kudos cards + action bar with "View Details" button)

## Context
- MoMorph ref: "View Kudo" screen (desktop: `onDIohs2bS` — no specs, iOS ref: `T0TR16k0vH`)
- User clicks "View Details" on any kudos card → URL changes to `/kudos/[id]`
- A modal/dialog opens **over** the existing `/kudos` live board (page does NOT change)
- Closing returns to `/kudos`
- Implementation: **Next.js App Router intercepting routes** (`@modal` parallel route)
- Direct URL access to `/kudos/[id]` (e.g., shared link) → same dialog appears over the board

## Visual Reference (from iOS "View Kudo")

The dialog shows a full kudos card:
- **Sender** → avatar + name + dept + badge (e.g. Rising Hero)
- **Arrow** →
- **Receiver** → avatar + name + dept + badge (e.g. Legend Hero)
- **Time**: `HH:mm - MM/DD/YYYY`
- **Message**: full text, no truncation
- **Image gallery**: thumbnails in a row (if any)
- **Hashtags**: `#Dedicated #Inspring...`
- **Action row**: like count (❤️) + Copy Link + close/back

## Architecture — Next.js Intercepting Routes

```
frontend/app/kudos/
├── layout.tsx                    ← accepts @modal slot
├── @modal/
│   └── (.)kudos/
│       └── [id]/
│           └── page.tsx          ← intercepted: renders KudosDetailModal (client component)
├── [id]/
│   └── page.tsx                  ← direct URL access: renders full page with modal
└── ... (existing files)
```

### How Intercepting Routes Work Here

- **Client navigation** (`router.push('/kudos/123')`): Next.js intercepts the route, renders `@modal/(.)kudos/[id]/page.tsx` in the `@modal` slot while keeping `/kudos` in the background. Modal appears over the live board.
- **Direct URL** (page refresh or shared link → `/kudos/123`): `@modal` slot is `null`, so `app/kudos/[id]/page.tsx` renders instead — it shows the live board + opens the modal (pass `id` as searchParam to the board).
- **Closing modal**: `router.back()` restores `/kudos` without a full reload.

### `frontend/app/kudos/layout.tsx`
```tsx
export default function KudosLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
```

### `frontend/app/kudos/@modal/(.)kudos/[id]/page.tsx`
```tsx
'use client'
import { KudosDetailModal } from '@/components/kudos/kudos-detail-modal'

export default function KudosDetailIntercepted({ params }: { params: { id: string } }) {
  return <KudosDetailModal id={params.id} />
}
```

### `frontend/app/kudos/[id]/page.tsx` (direct access fallback)
```tsx
// For direct URL access (/kudos/123 typed in browser or shared link)
// Renders the live board page with the modal forced open
import KudosPage from '@/app/kudos/page'   // reuse the board
import { KudosDetailModal } from '@/components/kudos/kudos-detail-modal'

export default function KudosDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <KudosPage />
      <KudosDetailModal id={params.id} />
    </>
  )
}
```

### `frontend/components/kudos/kudos-detail-modal.tsx`
```tsx
'use client'
// Props: { id: string }
// - Fetches GET /kudos/:id on mount
// - Renders backdrop + centered dialog card
// - Close button calls router.back()
// - Like toggle (reuses same optimistic logic from kudos-action-bar)
// - Copy link button
// - ESC key closes modal (useEffect keydown listener)
// - Trap focus inside modal (accessibility)
```

## Dialog Layout (desktop)
```
┌──────────────────────────────────────────────────────┐
│ [dark overlay, click outside → close]                │
│  ┌────────────────────────────────────────────────┐  │
│  │  [X]                                           │  │
│  │  Avatar Name Dept Badge → Avatar Name Dept     │  │
│  │  10:00 - 10/30/2025                            │  │
│  │  ─────────────────────────────────────────     │  │
│  │  Full message text (no line-clamp)             │  │
│  │  [img] [img] [img] [img] [img]                 │  │
│  │  #Dedicated #Inspring                          │  │
│  │  ─────────────────────────────────────────     │  │
│  │  ❤ 10    [Copy Link]                           │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```
- Dialog max-width: `640px`, centered
- Scrollable if content exceeds viewport height
- Background: same dark card bg as kudos cards (`rgba(255,255,255,0.05)` or similar)

## Backend — `GET /kudos/:id`

Add to Phase 02 backend (already planned for `GET /kudos/:id` — confirm it's implemented):
```ts
// Returns full KudosCard shape (same DTO as list endpoint)
// 404 if not found
```

## Related Code Files

**Create:**
- `frontend/app/kudos/layout.tsx`
- `frontend/app/kudos/@modal/(.)kudos/[id]/page.tsx`
- `frontend/app/kudos/[id]/page.tsx`
- `frontend/components/kudos/kudos-detail-modal.tsx`

**Modify:**
- `frontend/components/kudos/kudos-action-bar.tsx` — "View Details" button calls `router.push('/kudos/' + id)` instead of a link
- `backend/src/kudos/kudos.controller.ts` — add `GET /kudos/:id` endpoint (if not already in Phase 02)
- `backend/src/kudos/kudos.service.ts` — add `findOne(id)` method
- `frontend/lib/i18n.ts` — add `viewKudo`, `closeDialog` keys

## Todo
- [x] Add `GET /kudos/:id` to backend (Phase 02 supplement)
- [x] Create `frontend/app/kudos/layout.tsx` with `@modal` slot
- [x] Create `@modal/(.)kudos/[id]/page.tsx` (intercepted modal page)
- [x] Create `frontend/app/kudos/[id]/page.tsx` (direct URL fallback)
- [x] Create `kudos-detail-modal.tsx`:
  - [ ] Fetch `GET /kudos/:id`
  - [ ] Render full kudos detail card
  - [ ] Close on backdrop click, X button, ESC key
  - [ ] `router.back()` on close
  - [ ] Like toggle (reuse optimistic logic)
  - [ ] Copy link button
- [x] Update "View Details" button in `kudos-action-bar.tsx` to use `router.push`
- [x] Compile check

## Success Criteria
- Clicking "View Details" on any kudos card changes URL to `/kudos/[id]` and opens modal over live board
- Live board remains visible and interactive behind the modal overlay
- Refreshing `/kudos/[id]` directly shows the same modal over the live board
- ESC key, X button, and backdrop click all close the modal (restores `/kudos`)
- Like toggle works inside the dialog (syncs with the card in the background feed)
- Copy link copies the correct `/kudos/[id]` URL
- No full page reload when opening/closing the dialog

## Notes
- `@modal` parallel route in Next.js App Router requires `layout.tsx` in the parent segment — do NOT skip it
- Default export of `@modal` must be `null` initially: add `frontend/app/kudos/@modal/default.tsx` exporting `null`
- `router.back()` inside modal: if user navigated directly to `/kudos/[id]`, `back()` may exit the site — add fallback: `if (window.history.length <= 1) router.push('/kudos')` else `router.back()`

## MoMorph refs
- View Kudo (desktop, no specs): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/onDIohs2bS
- View Kudo (iOS reference): https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/T0TR16k0vH
