# Plan — Profile bản thân (My Profile) screen

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb
Discipline: `--auto` (MoMorph two-track). See `clarifications.md`.

## Goal
Build the logged-in user's profile page at `/profile/[email]`:
hero (avatar+name+badge+icon collection) → stats box → awards header + filter → paginated kudos list.
Reuse existing components heavily (KudosPostCard, SidebarStats pattern, badge, SiteHeader/Footer).

## Track B — Backend (COMPLETE ✓ 2026-05-31)
1. **Filter sender/receiver (DONE)** — KudosQueryDto, KudosService.findAll with WHERE clauses. GET /kudos supports ?sender= / ?receiver=.
2. **Profile stats endpoint (DONE)** — GET /kudos/profile/:email returns { user, kudosReceived, kudosSent, heartsReceived }.
3. **Build & tests (DONE)** — Backend build ✓, 59 unit + 12 e2e tests pass ✓.

## Track A — UI (COMPLETE ✓ 2026-05-31)
Components & routing (DONE):
- `app/profile/[email]/page.tsx` — route, fetch profile + kudos
- `components/profile/profile-hero.tsx` — hero banner + avatar + badge
- `components/profile/profile-icon-collection.tsx` — placeholder collection
- `components/profile/profile-stats-box.tsx` — stats layout
- `components/profile/profile-kudos-section.tsx` — kudos list + Sent/Received filter + Load More
- i18n keys added (VN+EN) — `lib/i18n.ts`
- Frontend build ✓

## Integration (COMPLETE ✓ 2026-05-31)
Real endpoint wiring (DONE): profile from GET /kudos/profile/:email, kudos from GET /kudos?sender= / ?receiver=. Email encoding in profile links: user-info-block.tsx, sidebar-recipients.tsx, user-profile-dropdown.tsx.
