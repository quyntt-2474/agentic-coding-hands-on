# Phase 04 — Frontend: Highlight Kudos Carousel

**Priority:** High
**Status:** ✅ Done
**Effort:** ~2.5h
**Blocked by:** Phase 03 (page scaffold)

## Context
- MoMorph specs B, B.1–B.5 — HIGHLIGHT KUDOS section
- Top 5 kudos by likeCount, displayed in a carousel with prev/next nav
- Filters: Hashtag dropdown (B.1.1) + Phòng ban dropdown (B.1.2)
- Cards show sender/receiver info, time, message (max 3 lines), hashtags, like count
- No external carousel library — implement with CSS transform + useState

## Design Specs

### Section Header (B.1)
- Subtitle: `'Sun* Annual Awards 2025'` — small, muted, uppercase
- Title: `'HIGHLIGHT KUDOS'` — large bold gold (`#FFEA9E`), Montserrat Alternates
- Two filter buttons: `'Hashtag'` and `'Phòng ban'` — pill-shaped dropdowns
  - Active state: filled gold bg + dark text
  - Inactive: outlined border + white text
  - Dropdown list sourced from API `/hashtags` and `/departments`

### Carousel (B.2 / B.2.3)
- Shows 5 cards; active card center-prominent, adjacent cards faded + scaled down
- Prev (B.2.1) / Next (B.2.2) arrow buttons — circular, disabled at first/last
- Page indicator (B.5.2): `'2/5'` format, updates on slide change
- No auto-scroll (manual only)

### Kudos Card (B.3 / B.4)
- Sender block (B.3.1 avatar + B.3.2 info): avatar circle + name + department + stars (★)
  - Click name/avatar → navigate to `/profile/[email]`
  - Hover avatar → profile preview (skip hover preview for now — out of scope)
- Arrow icon (B.3.4): decorative → (sent to)
- Receiver block (B.3.5 avatar + B.3.6 info): same layout as sender
- Time (B.4.1): format `HH:mm - MM/DD/YYYY`
- Message (B.4.2): max 3 lines, overflow ellipsis (`line-clamp-3`)
- Hashtags (B.4.3): `#Tag1 #Tag2 ...` — each clickable → filters list
- Action bar (B.4.4): heart icon + like count, disabled if sender = currentUser

## Architecture

```
frontend/components/kudos/
├── highlight-section.tsx         ← section wrapper, fetches data, owns filter state
├── highlight-carousel.tsx        ← carousel logic (index state, prev/next)
├── highlight-kudos-card.tsx      ← individual card layout
├── filter-dropdown.tsx           ← reusable hashtag/dept dropdown (shared with Phase 05)
└── user-info-block.tsx           ← avatar + name + dept + stars (shared with Phase 05)
```

### State in `highlight-section.tsx`
```ts
const [activeHashtag, setActiveHashtag] = useState<string | null>(null)
const [activeDept, setActiveDept]       = useState<string | null>(null)
const [kudos, setKudos]                 = useState<KudosCard[]>([])
const [hashtags, setHashtags]           = useState<string[]>([])
const [departments, setDepts]           = useState<string[]>([])
```
Fetch `GET /kudos/highlight?hashtag=&department=` on filter change.

### Carousel Logic in `highlight-carousel.tsx`
```ts
const [current, setCurrent] = useState(0)
// items = kudos array (max 5)
// prev: disabled when current === 0
// next: disabled when current === items.length - 1
// CSS: translate cards with transform: translateX based on (index - current) * cardWidth
```

### `user-info-block.tsx` props
```ts
{ email: string; name: string; picture: string; department: string; stars: number; size?: 'sm' | 'md' }
```

### `filter-dropdown.tsx` props
```ts
{ label: string; options: string[]; value: string | null; onChange: (v: string | null) => void }
```

## Implementation Steps

1. Create `frontend/components/kudos/user-info-block.tsx` — shared avatar+info block
2. Create `frontend/components/kudos/filter-dropdown.tsx` — dropdown with active/clear state
3. Create `frontend/components/kudos/highlight-kudos-card.tsx` — card layout
4. Create `frontend/components/kudos/highlight-carousel.tsx` — carousel with CSS transform
5. Create `frontend/components/kudos/highlight-section.tsx`:
   - Fetch `GET /kudos/highlight` on mount + filter change
   - Fetch `GET /hashtags` and `GET /departments` on mount
   - Pass data to carousel
6. Add `<HighlightSection />` to `frontend/app/kudos/page.tsx`
7. Add `NEXT_PUBLIC_API_URL=http://localhost:3000` to `frontend/.env.local`
8. Compile check

## Related Code Files

**Create:**
- `frontend/components/kudos/highlight-section.tsx`
- `frontend/components/kudos/highlight-carousel.tsx`
- `frontend/components/kudos/highlight-kudos-card.tsx`
- `frontend/components/kudos/filter-dropdown.tsx`
- `frontend/components/kudos/user-info-block.tsx`

**Modify:**
- `frontend/app/kudos/page.tsx` — add `<HighlightSection />`
- `frontend/.env.local` — add `NEXT_PUBLIC_API_URL`
- `frontend/.env.example` — add `NEXT_PUBLIC_API_URL`

## Todo
- [x] Create `user-info-block.tsx`
- [x] Create `filter-dropdown.tsx`
- [x] Create `highlight-kudos-card.tsx`
- [x] Create `highlight-carousel.tsx` with prev/next + page indicator
- [x] Create `highlight-section.tsx` with filter state + fetch
- [x] Wire into `kudos/page.tsx`
- [x] Add `NEXT_PUBLIC_API_URL` env var
- [x] Compile check

## Success Criteria
- Highlight section renders with top-5 kudos cards
- Prev/Next buttons navigate slides; disabled at ends
- Page indicator shows `X/5`
- Hashtag filter dropdown opens, selecting filters cards
- Phòng ban filter works independently
- Sender/receiver name click navigates to `/profile/[email]`
- Like count displayed; heart button disabled for own kudos
- Cards show message truncated at 3 lines

## Risk Assessment
- Carousel without library: keep it simple — translateX only, no touch/swipe needed (desktop-first per design)
- Filter dropdowns: close on outside click — use `useEffect` with `mousedown` listener
