# Phase 07 — Frontend: i18n Strings + Full API Integration + Polling

**Priority:** High
**Status:** ✅ Done
**Effort:** ~1.5h
**Blocked by:** Phase 03–06 (all frontend phases)

## Context
- All kudos components are built; Phase 07 wires them to the real backend API
- Add all missing i18n keys to `frontend/lib/i18n.ts`
- Implement polling hook (`useInterval`) to refresh feed + highlight every 15s
- Centralise API base URL via `NEXT_PUBLIC_API_URL` env var
- Final compile + smoke test

## i18n Keys to Add

Add to both `VN` and `EN` blocks in `frontend/lib/i18n.ts`:

```ts
// Kudos live board
kudosLiveTitle: 'Hệ thống ghi nhận lời cảm ơn' / 'Recognition System',
kudosInputPlaceholder: 'Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?' / 'Who do you want to thank today?',
kudosComingSoon: 'Chức năng đang phát triển' / 'Feature coming soon',
highlightTitle: 'HIGHLIGHT KUDOS' / 'HIGHLIGHT KUDOS',
allKudosTitle: 'ALL KUDOS' / 'ALL KUDOS',
spotlightTitle: 'SPOTLIGHT' / 'SPOTLIGHT',
filterHashtag: 'Hashtag' / 'Hashtag',
filterDepartment: 'Phòng ban' / 'Department',
kudosEmptyFeed: 'Hiện tại chưa có Kudos nào.' / 'No kudos yet.',
kudosEmptyLeaderboard: 'Chưa có dữ liệu' / 'No data yet',
loadMore: 'Xem thêm' / 'Load more',
copyLinkToast: 'Link copied — ready to share!' / 'Link copied — ready to share!',
recentRecipients: '10 SUNNER NHẬN QUÀ MỚI NHẤT' / 'TOP 10 RECENT RECIPIENTS',
openGiftButton: 'Mở quà' / 'Open Gift',
kudosReceived: 'Số Kudos bạn nhận được' / 'Kudos received',
kudosSent: 'Số Kudos bạn đã gửi' / 'Kudos sent',
heartsReceived: 'Số tim bạn nhận được' / 'Hearts received',
secretBoxOpened: 'Số Secret Box bạn đã mở' / 'Secret Boxes opened',
secretBoxUnoepned: 'Số Secret Box chưa mở' / 'Secret Boxes unopened',
spotlightSearch: 'Tìm kiếm' / 'Search',
spotlightTotal: 'KUDOS' / 'KUDOS',
loginRequired: 'Vui lòng đăng nhập để thực hiện' / 'Please log in to continue',
```

## API Integration Centralisation

Create `frontend/lib/api.ts` — thin fetch wrapper:

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<T>
}
```

All components should import from `@/lib/api` — replace any inline `fetch` calls added in earlier phases.

## Polling Hook

Create `frontend/lib/use-interval.ts`:

```ts
import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)
  useEffect(() => { savedCallback.current = callback })
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
```

### Polling Integration
- In `highlight-section.tsx`: call `useInterval(fetchHighlight, 15_000)`
- In `kudos-feed.tsx`: call `useInterval(fetchFirstPage, 15_000)` — refreshes page 1, merges new items at top

## Type Definitions

Create `frontend/lib/types/kudos.ts` — shared TS interfaces:

```ts
export interface KudosUser {
  email: string
  name: string
  picture: string
  department: string
  stars: number
}

export interface KudosCard {
  id: string
  sender: KudosUser
  receiver: KudosUser
  message: string
  hashtags: string[]
  likeCount: number
  likedByMe: boolean
  createdAt: string
}

export interface SpotlightWord {
  name: string
  email: string
  count: number
}

export interface KudosStats {
  kudosReceived: number
  kudosSent: number
  heartsReceived: number
  recentRecipients: Pick<KudosUser, 'email' | 'name' | 'picture'>[]
}
```

Replace any inline type definitions in earlier phase components with these shared types.

## Implementation Steps

1. Create `frontend/lib/types/kudos.ts` with all shared interfaces
2. Create `frontend/lib/api.ts` with `apiFetch` wrapper
3. Create `frontend/lib/use-interval.ts` polling hook
4. Update `frontend/lib/i18n.ts` — add all kudos live board keys to both VN + EN
5. Update all kudos components to import from `@/lib/api` (replace raw `fetch`)
6. Update all kudos components to use `@/lib/types/kudos` types
7. Add `useInterval` in `highlight-section.tsx` and `kudos-feed.tsx`
8. Run `npm run build` — zero TypeScript errors
9. Start backend + frontend; smoke test all sections
10. Verify polling: open network tab, confirm `/kudos` refetch every ~15s

## Related Code Files

**Create:**
- `frontend/lib/api.ts`
- `frontend/lib/use-interval.ts`
- `frontend/lib/types/kudos.ts`

**Modify:**
- `frontend/lib/i18n.ts` — add all kudos live board keys
- `frontend/components/kudos/highlight-section.tsx` — add `useInterval`
- `frontend/components/kudos/kudos-feed.tsx` — add `useInterval`
- All kudos components — switch raw fetch to `apiFetch` from `@/lib/api`
- `frontend/.env.example` — ensure `NEXT_PUBLIC_API_URL` present

## Todo
- [x] Create `frontend/lib/types/kudos.ts`
- [x] Create `frontend/lib/api.ts`
- [x] Create `frontend/lib/use-interval.ts`
- [x] Add all i18n keys to `frontend/lib/i18n.ts` (VN + EN)
- [x] Refactor all kudos components to use `apiFetch`
- [x] Add `useInterval(15_000)` to highlight + feed components
- [x] `npm run build` → zero errors
- [x] Smoke test: all sections render with backend running
- [x] Verify 15s polling in browser network tab

## Success Criteria
- `npm run build` exits with code 0, zero TS errors
- All text strings driven by `useTranslations()` — no hardcoded Vietnamese in JSX
- Polling: `/kudos/highlight` and `/kudos` refetch automatically every 15s
- API calls include `Authorization: Bearer <token>` when user is logged in
- Switching language (VN ↔ EN) updates all kudos page strings instantly

## Notes
- `apiFetch` is client-only (uses `localStorage`) — only call from `'use client'` components
- `useInterval` with `delay: null` pauses polling (useful for dev/test)
