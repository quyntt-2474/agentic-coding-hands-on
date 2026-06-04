# Phase 05 — Frontend: All Kudos Feed + Sidebar

**Priority:** High
**Status:** ✅ Done
**Effort:** ~3h
**Blocked by:** Phase 04 (shared components: user-info-block, filter-dropdown)

## Context
- MoMorph specs C (All Kudos feed) + D (Sidebar)
- Two-column layout: feed on left (~2/3 width), sidebar on right (~1/3 width)
- Feed: paginated list of kudos cards with like/copy-link actions
- Sidebar: user stats + "Mở quà" button + 10 recent gift recipients

## Design Specs

### Section Header (C.1)
- Subtitle: `'Sun* Annual Awards 2025'` muted uppercase
- Title: `'ALL KUDOS'` — large bold gold, Montserrat Alternates

### Kudos Post Card (C.3 / C.4)
- Sender block (C.3.1): avatar + name + dept + stars — click navigates to profile
- Sent icon (C.3.2): small decorative "sent" arrow icon (static)
- Receiver block (C.3.3): same layout as sender
- Time (C.3.4): `HH:mm - MM/DD/YYYY` format
- Content (C.3.5): message, **max 5 lines** (`line-clamp-5`), overflow `...`
- Image gallery (C.3.6): skip (no images in scope) — omit if empty
- Hashtags (C.3.7): `#Tag` list — each clickable → filters feed
- Actions (C.4):
  - **Like (C.4.1)**: heart icon (gray = unliked, red = liked) + count
    - Toggle on click (optimistic update)
    - Disabled if `sender.email === currentUserEmail`
    - Disabled if unauthenticated (show tooltip: requires login)
  - **Copy Link (C.4.2)**: copies `window.location.origin + '/kudos/' + id` to clipboard
    - Shows toast: `'Link copied — ready to share!'`
  - **View Details**: navigates to `/kudos/[id]` (page not yet built — link only)
- Empty state: `'Hiện tại chưa có Kudos nào.'`

### Pagination / Load More
- Load More button at bottom of feed (simpler than infinite scroll)
- Calls `GET /kudos?page=N&limit=20`
- Appends to existing list

### Sidebar (D)

#### Stats section (D.1)
User must be authenticated to see personal stats; show login prompt if not.
Stats rows:
- `Số Kudos bạn nhận được: {kudosReceived}`
- `Số Kudos bạn đã gửi: {kudosSent}`
- `Số tim bạn nhận được: {heartsReceived}`
- `Số Secret Box bạn đã mở: 0` (static — out of scope)
- `Số Secret Box chưa mở: 0` (static — out of scope)
- Divider (D.1.5)
- **"Mở quà" button (D.1.8)**: shows "coming soon" toast (same toast component)

#### Recent recipients (D.3)
- Header: `'10 SUNNER NHẬN QUÀ MỚI NHẤT'`
- List: 10 most recent kudos receivers — avatar + name
  - Click avatar/name → `/profile/[email]`
- Empty state: `'Chưa có dữ liệu'`

#### Hashtag cloud (D.4)
- Popular hashtags as clickable chips — clicking filters the feed

## Architecture

```
frontend/components/kudos/
├── all-kudos-section.tsx        ← two-column layout wrapper
├── kudos-feed.tsx               ← feed list + load more + filter state
├── kudos-post-card.tsx          ← individual post card (C.3 + C.4)
├── kudos-action-bar.tsx         ← like + copy-link + view-details bar
├── kudos-sidebar.tsx            ← full sidebar (D.1 + D.3 + D.4)
├── sidebar-stats.tsx            ← D.1 stats block
├── sidebar-recipients.tsx       ← D.3 recent recipients
└── (reuse) kudos-toast.tsx      ← from Phase 03
```

### State in `kudos-feed.tsx`
```ts
const [kudos, setKudos]           = useState<KudosCard[]>([])
const [page, setPage]             = useState(1)
const [total, setTotal]           = useState(0)
const [activeHashtag, setHashtag] = useState<string | null>(null)
const [activeDept, setDept]       = useState<string | null>(null)
const [loading, setLoading]       = useState(false)
```
Fetch `GET /kudos?page=1&limit=20` on mount; append on "Load More".

### Like Toggle in `kudos-action-bar.tsx`
```ts
// Optimistic update:
setKudos(prev => prev.map(k =>
  k.id === id ? { ...k, likedByMe: !k.likedByMe, likeCount: k.likedByMe ? k.likeCount - 1 : k.likeCount + 1 } : k
))
// Then call POST/DELETE /kudos/:id/like
// On error: revert the optimistic update
```

### Stats fetch in `sidebar-stats.tsx`
```ts
// On mount: if JWT token exists, fetch GET /kudos/stats
// Else show login prompt
```

## Implementation Steps

1. Create `frontend/components/kudos/kudos-action-bar.tsx` — like toggle + copy link + view details
2. Create `frontend/components/kudos/kudos-post-card.tsx` — full card layout, reuses `user-info-block`
3. Create `frontend/components/kudos/kudos-feed.tsx` — list + load more + hashtag/dept filter passthrough
4. Create `frontend/components/kudos/sidebar-stats.tsx` — stats display with auth check
5. Create `frontend/components/kudos/sidebar-recipients.tsx` — 10 recent recipients list
6. Create `frontend/components/kudos/kudos-sidebar.tsx` — compose sidebar sections
7. Create `frontend/components/kudos/all-kudos-section.tsx` — two-column grid layout
8. Add `<AllKudosSection />` to `frontend/app/kudos/page.tsx`
9. Compile check

## Related Code Files

**Create:**
- `frontend/components/kudos/all-kudos-section.tsx`
- `frontend/components/kudos/kudos-feed.tsx`
- `frontend/components/kudos/kudos-post-card.tsx`
- `frontend/components/kudos/kudos-action-bar.tsx`
- `frontend/components/kudos/kudos-sidebar.tsx`
- `frontend/components/kudos/sidebar-stats.tsx`
- `frontend/components/kudos/sidebar-recipients.tsx`

**Modify:**
- `frontend/app/kudos/page.tsx` — add `<AllKudosSection />`
- `frontend/lib/i18n.ts` — add feed/sidebar i18n keys (Phase 07)

## Todo
- [x] Create `kudos-action-bar.tsx` with like toggle (optimistic) + copy link + toast
- [x] Create `kudos-post-card.tsx`
- [x] Create `kudos-feed.tsx` with pagination + empty state
- [x] Create `sidebar-stats.tsx` with auth-conditional display
- [x] Create `sidebar-recipients.tsx`
- [x] Create `kudos-sidebar.tsx`
- [x] Create `all-kudos-section.tsx` two-column layout
- [x] Wire into page
- [x] Compile check

## Success Criteria
- Feed renders kudos list; "Load More" appends next page
- Empty state shown when no kudos
- Like toggle updates count optimistically; reverts on API error
- Copy link puts URL in clipboard + shows toast
- Sender cannot like own kudos (heart button disabled)
- Unauthenticated users see like button disabled
- Sidebar stats visible when logged in
- "Mở quà" button shows "coming soon" toast
- Recent recipients list shows 10 items, click navigates to profile
- Sidebar empty state: `'Chưa có dữ liệu'`

## Security
- Never expose JWT token in card data — only email for comparison
- Clipboard API requires HTTPS in prod; works on localhost dev
