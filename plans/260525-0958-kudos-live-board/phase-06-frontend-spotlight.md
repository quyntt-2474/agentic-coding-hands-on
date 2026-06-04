# Phase 06 — Frontend: Spotlight Word Cloud

**Priority:** Medium
**Status:** ✅ Done
**Effort:** ~2h
**Blocked by:** Phase 03 (page scaffold)
**Can run in parallel with:** Phase 04, Phase 05

## Context
- MoMorph specs B.6, B.7, B.7.1–B.7.3
- Interactive word cloud showing recipient names (size proportional to kudos count)
- Library: `d3-cloud` (npm: `d3-cloud`) + custom React SVG renderer
- Features: pan/zoom toggle (B.7.2), search bar (B.7.3), total count label (B.7.1)
- Data from `GET /kudos/spotlight` → `{ name, email, count }[]`

## Design Specs

### Section Header (B.6)
- Subtitle: `'Sun* Annual Awards 2025'` — muted uppercase
- Title: `'SPOTLIGHT'` — large bold gold Montserrat Alternates (same pattern as other section headers)

### Spotlight Board (B.7)
- Canvas/SVG area: dark background with word cloud of recipient names
- Word size: proportional to `count` — min `14px`, max `48px`
- Word colors: mix of white + gold tones
- Total count label (B.7.1): e.g., `'388 KUDOS'` top-left of board
- Pan/Zoom toggle button (B.7.2): icon button top-right — toggles between pan and zoom mode
  - Pan mode: dragging pans the view
  - Zoom mode: scroll/pinch zooms
  - Implement with CSS `transform: translate + scale` via mouse events
- Search bar (B.7.3):
  - Input with magnifier icon, placeholder: `'Tìm kiếm'`
  - Max 100 chars; required (don't search on empty)
  - On input: highlights matching word(s) in the cloud (opacity dimmed for non-matches)
- Node interactions:
  - Hover: tooltip showing name + kudos count (B.7.3 spec)
  - Click: navigates to `/kudos?receiver=[email]` (filtered feed — link only, no new page needed)
- Empty state: show message if no data
- Loading state: spinner while fetching

## Architecture

```
frontend/components/kudos/
├── spotlight-section.tsx         ← section wrapper, fetches data, owns search state
├── spotlight-word-cloud.tsx      ← d3-cloud layout + SVG render + pan/zoom
└── spotlight-search.tsx          ← search input with magnifier icon
```

### `d3-cloud` Integration Pattern

```tsx
// spotlight-word-cloud.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import cloud from 'd3-cloud'   // npm install d3-cloud @types/d3-cloud

type WordDatum = { text: string; email: string; count: number; x?: number; y?: number; rotate?: number; size?: number }

// 1. Run d3-cloud layout on words array
// 2. On layout end callback: store computed word positions in state
// 3. Render <svg> with <text> elements at computed positions
// 4. Pan/zoom: maintain { x, y, scale } state; apply via transform on <g> container
// 5. Mouse events on SVG for pan (mousedown + mousemove + mouseup)
// 6. Wheel event for zoom
// 7. Search highlight: dim words that don't match search string (opacity 0.2)
```

### Font Sizes
```ts
const minCount = Math.min(...words.map(w => w.count))
const maxCount = Math.max(...words.map(w => w.count))
const fontSize = (count: number) =>
  14 + ((count - minCount) / (maxCount - minCount || 1)) * 34
  // range: 14px–48px
```

### Pan/Zoom State
```ts
const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
const [mode, setMode] = useState<'pan' | 'zoom'>('pan')
```
- Pan mode: `onMouseDown` → `onMouseMove` → `setTransform` translate
- Zoom mode: `onWheel` → `setTransform` scale (clamp 0.5–4)

### Tooltip
```ts
const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null)
```
Show on `onMouseEnter`, hide on `onMouseLeave`.

## Implementation Steps

1. Install `d3-cloud`: `npm i d3-cloud` in `frontend/`; add `@types/d3-cloud` or declare module
2. Create `frontend/components/kudos/spotlight-search.tsx` — input + magnifier icon + max-100 validation
3. Create `frontend/components/kudos/spotlight-word-cloud.tsx`:
   - Accept `words: WordDatum[]` + `searchTerm: string`
   - Run d3-cloud layout in `useEffect` when `words` changes
   - Render SVG with pan/zoom container `<g>`
   - Per-word `<text>` with hover tooltip + click navigation
   - Pan/Zoom mode toggle button (top-right of SVG)
4. Create `frontend/components/kudos/spotlight-section.tsx`:
   - Fetch `GET /kudos/spotlight` on mount
   - Own `searchTerm` state → pass to word cloud for highlight
   - Show total count from `words.reduce((s, w) => s + w.count, 0)`
5. Add `<SpotlightSection />` to `frontend/app/kudos/page.tsx` (between Highlight and AllKudos)
6. Compile check — `d3-cloud` runs layout in a Web Worker internally; ensure SSR safety with `'use client'`

## Related Code Files

**Create:**
- `frontend/components/kudos/spotlight-section.tsx`
- `frontend/components/kudos/spotlight-word-cloud.tsx`
- `frontend/components/kudos/spotlight-search.tsx`

**Modify:**
- `frontend/app/kudos/page.tsx` — add `<SpotlightSection />`
- `frontend/package.json` — add `d3-cloud`

## Todo
- [x] Install `d3-cloud` package
- [x] Create `spotlight-search.tsx`
- [x] Create `spotlight-word-cloud.tsx` with d3-cloud layout + SVG render
- [x] Implement pan mode (mouse drag)
- [x] Implement zoom mode (mouse wheel)
- [x] Implement search highlight (dim non-matching words)
- [x] Implement hover tooltip (name + count)
- [x] Implement click → navigate to filtered feed
- [x] Create `spotlight-section.tsx` with data fetch + total count
- [x] Wire into page
- [x] Compile check

## Success Criteria
- Word cloud renders recipient names sized by kudos count
- Total kudos count label shows correct sum
- Typing in search dims non-matching words
- Hovering a word shows tooltip with name and count
- Clicking a word navigates to `/kudos?receiver=[email]`
- Pan mode: drag moves the cloud
- Zoom mode: scroll zooms in/out (clamped 0.5×–4×)
- Loading spinner shown while fetching
- Empty state shown when no spotlight data

## Risk Assessment
- **d3-cloud + SSR**: must be `'use client'` — d3 uses `document`; will crash on server render
- **d3-cloud type definitions**: `@types/d3-cloud` may not exist; may need `declare module 'd3-cloud'` in a `.d.ts` file
- **Layout re-run cost**: re-running d3-cloud layout on every render is expensive — memoize with `useMemo` + run only when `words` changes
- **Pan + zoom state conflict**: keep mode toggle clear in UI; default to pan mode
