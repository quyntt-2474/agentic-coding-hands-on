# Sun* Kudos Live Board — Implementation Plan

**Status:** ✅ Complete
**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
**Clarifications:** `./clarifications.md`
**Branch:** develop

## Phases

| # | Phase | Status |
|---|-------|--------|
| 01 | Backend — TypeORM + PostgreSQL DB setup | ✅ |
| 02 | Backend — Kudos REST API | ✅ |
| 03 | Frontend — /kudos page scaffold + KV Hero + Input trigger | ✅ |
| 04 | Frontend — Highlight Kudos carousel | ✅ |
| 05 | Frontend — All Kudos feed + Sidebar | ✅ |
| 06 | Frontend — Spotlight word cloud | ✅ |
| 07 | Frontend — i18n strings + full API integration + polling | ✅ |
| 08 | Frontend — Kudos detail dialog (`/kudos/[id]` intercepting route) | ✅ |

## Scope (IN)
- `/kudos` live board page with all sections from the MoMorph screen
- Backend API: kudos CRUD, likes, hashtags, departments, stats, spotlight
- TypeORM + PostgreSQL persistence
- Polling-based live updates (15s interval)
- d3-cloud word cloud for Spotlight section
- Hashtag + department filters on Highlight and All Kudos sections
- Kudos detail dialog: `/kudos/[id]` via Next.js intercepting routes — overlay modal on `/kudos`, NOT a new page

## Scope (OUT)
- Kudos submission dialog (A.1 input just shows "coming soon" toast)
- Secret Box dialog
- Profile page `/profile/[email]`
- Image upload / attachment gallery (cards show no images)
- Special day (+2 hearts) admin config
- WebSocket real-time

## Key Design Decisions
- TypeORM + PostgreSQL (Docker Compose for local dev)
- Word cloud: `d3-cloud` npm package + custom React SVG component
- Polling: `useInterval` hook wrapping `fetch` every 15 000 ms
- Like toggle: optimistic UI update + server re-sync on error
- Empty states: "Hiện tại chưa có Kudos nào." (feed), "Chưa có dữ liệu" (leaderboard)

## MoMorph refs
- Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
