# Screen List

**Project**: Sun* Kudos
**Generated**: 2026-06-01
**Analysis Scope**: frontend/app/** page routes + component files; stack = JS/TS (Next.js 16 App Router)

**Code Format**: All codes follow `SCR###_NameSlug` | `SCR###/REG###` for region-scoped references.

**Note**: Feature mapping is in FeatureList.md only. UserStory mapping is in UserStories.md.

**Region Guidance**: REG declared only when ≥1 independence signal exists: distinct API endpoint (read or write), independent loading state, independent scroll container, independent auth/permission gate, distinct business workflow, distinct mutation surface.

---

## Screen Index

| Code | Name | Type | Route | Auth |
|------|------|------|-------|------|
| SCR001_HomePage | Home Page | composite | / | required |
| SCR002_LoginPage | Login Page | atomic | /login | public |
| SCR003_AuthCallback | Auth Callback | atomic | /auth/callback | public |
| SCR004_CountdownPage | Countdown / Pre-launch | atomic | /countdown | public |
| SCR005_AwardsPage | Awards Info Page | composite | /awards | required |
| SCR006_CommunityStandardsPage | Community Standards | atomic | /community-standards | required |
| SCR007_KudosPage | Kudos Feed Page | composite | /kudos | required |
| SCR008_KudosDetailModal | Kudos Detail Modal | atomic | /kudos/:id (intercepted + direct) | required |
| SCR009_ProfilePage | User Profile Page | composite | /profile/:email | required |

---

## SCR001_HomePage

**Type**: composite

### Description

Landing page rendered at `/`. Assembles header, hero+description band, awards overview section, kudos CTA section, footer, and floating widget. No API call at the page level — all data consumption is static/i18n. Composite classification: H3 passes (≥3 named section wrappers: `HeroSection`, `AwardsSection`, `KudosSection`); H2 fails (imports all from `@/components/homepage/*` — excluded UI path); H1: 3 feature refs (hero/awards/kudos CTA). Gate: H1∧H3 → composite.

**Source**: `frontend/app/page.tsx` (imports: SiteHeader, HeroSection, AwardsSection, KudosSection, SiteFooter, WidgetButton)

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| SiteHeader | layout | Top navigation bar with current path highlight and user dropdown |
| HeroSection | section | Hero banner with countdown timer, event info, CTA buttons to /awards and /kudos |
| AwardsSection | section | Static awards grid — 6 award cards with titles and descriptions (no API) |
| KudosSection | section | Kudos marketing CTA block with link to /kudos (no API) |
| SiteFooter | layout | Page footer |
| WidgetButton | overlay | Floating FAB: opens write-kudos modal or community rules modal |

### Data Displayed

- Award catalogue (static i18n, no API)
- Event countdown (client-side timer to hardcoded date)
- Navigation state

### Routes/URLs

- `/`

### Related Screens

- SCR005_AwardsPage (CTA link from HeroSection → /awards)
- SCR007_KudosPage (CTA link from HeroSection and KudosSection → /kudos)
- SCR008_KudosDetailModal (write-kudos modal opens inline via WidgetButton)

### Regions

| Code | Label | Source File:Approx Line | Independence Signals |
|------|-------|------------------------|---------------------|
| REG001_HeroBand | Hero + Event Info Band | `frontend/components/homepage/hero-section.tsx:1` | Distinct UI zone; client-side timer only (no API); distinct navigation surface — CTA buttons to /awards, /kudos |
| REG002_AwardsGrid | Awards Overview Grid | `frontend/components/homepage/awards-section.tsx:1` | Static data zone; distinct visual frame; distinct business context (award catalogue) |
| REG003_KudosCTA | Kudos Call-to-Action Band | `frontend/components/homepage/kudos-section.tsx:1` | Distinct navigation surface (link to /kudos); distinct business workflow (platform intro) |

> Note: SiteHeader/SiteFooter/WidgetButton are shared layout — not REGs. REG001–REG003 are the three main content zones. Visual-only separation acknowledged; each REG carries at least one non-visual signal (distinct navigation surface / distinct business workflow).

---

## SCR002_LoginPage

**Type**: atomic

### Description

Public login page at `/login`. Renders static login UI with Google OAuth CTA. Redirects to `/` if token already present in localStorage. No API call from this page; Google OAuth flow initiates via `GET /auth/google` backend redirect (user navigates away). H3=2 named wrappers (LoginHeader, LoginHero — LanguageProvider is not a content region); H2=0 (no domain module imports); H1=2 feature refs. Gate: 2-of-3 not met → atomic.

**Source**: `frontend/app/login/page.tsx`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| LanguageProvider | context | i18n context for VN/EN toggle |
| LoginHeader | layout | Language selector + logo |
| LoginHero | section | Google sign-in button, tagline |
| LoginFooter | layout | Footer text |

### Data Displayed

- Static UI only (no entity data)

### Routes/URLs

- `/login`

### Related Screens

- SCR003_AuthCallback (Google OAuth callback target)
- SCR001_HomePage (redirect if already authenticated)

---

## SCR003_AuthCallback

**Type**: atomic

### Description

Handles Google OAuth redirect at `/auth/callback`. Extracts `token` query param, stores in localStorage, then redirects to `/`. Renders only a spinner — no persistent UI. No API call; token arrives as URL param. Atomic: single-purpose, no regions.

**Source**: `frontend/app/auth/callback/page.tsx`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| Spinner | loader | Full-screen loading indicator while processing OAuth callback |
| CallbackInner | logic | Reads `?token=` param, persists to localStorage, redirects |

### Data Displayed

- None (transient only)

### Routes/URLs

- `/auth/callback`

### Related Screens

- SCR001_HomePage (post-auth redirect destination)

---

## SCR004_CountdownPage

**Type**: atomic

### Description

Pre-launch countdown page at `/countdown`. Renders `PrelaunchPage` component — client-side countdown timer with static i18n content. Public route. No API. Atomic: single component, no independence signals for regions.

**Source**: `frontend/app/countdown/page.tsx`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| PrelaunchPage | page | Full-screen countdown clock with event info |

### Data Displayed

- Countdown to hardcoded event date (client-side calculation)

### Routes/URLs

- `/countdown`

### Related Screens

- SCR001_HomePage (implied nav)

---

## SCR005_AwardsPage

**Type**: composite

### Description

Awards information page at `/awards`. Assembles hero, scrollable award detail section (6 award cards with sticky nav), kudos CTA section, and shared footer. Composite: H3 passes (≥3 named section wrappers: `AwardInfoHero`, `AwardInfoSection`, `KudosSection`); H1=3 feature refs (award info, nav, kudos CTA). Gate: H1∧H3 → composite. No API calls — all data is static/i18n.

**Source**: `frontend/app/awards/page.tsx`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| SiteHeader | layout | Top navigation |
| AwardInfoHero | section | Hero banner for awards page |
| AwardInfoSection | section | Scrollable award detail cards (6 awards) with sticky desktop nav + mobile horizontal nav |
| KudosSection | section | Reused kudos CTA band (same as homepage) |
| SiteFooter | layout | Page footer |
| WidgetButton | overlay | Floating FAB |

### Data Displayed

- 6 award descriptions with prize values (static i18n)
- Scroll position tracking (client state only)

### Routes/URLs

- `/awards`

### Related Screens

- SCR001_HomePage (nav link)
- SCR007_KudosPage (CTA link from KudosSection)

### Regions

> Note: `AwardInfoHero` is a static visual banner (background image + logo + title text, no API, no CTA links, no interactive elements). It has no non-visual independence signal and is therefore NOT a region — it is folded into the SCR005 page description as a layout sub-component.

| Code | Label | Source File:Approx Line | Independence Signals |
|------|-------|------------------------|---------------------|
| REG001_AwardDetailSection | Award Detail Cards + Sticky Nav | `frontend/components/award-info/award-info-section.tsx:1` | Independent scroll tracking (client state); distinct business workflow (award detail browsing with sticky nav) |
| REG002_KudosCTA | Kudos CTA Band | `frontend/components/homepage/kudos-section.tsx:1` | Distinct navigation surface (link to /kudos); reused component with distinct business workflow |

---

## SCR006_CommunityStandardsPage

**Type**: atomic

### Description

Community standards page at `/community-standards`. Renders hero + content block. No API. H3=2 named wrappers (CommunityStandardsHero, CommunityStandardsContent); H2=0; H1=2. Gate fails → atomic.

**Source**: `frontend/app/community-standards/page.tsx`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| SiteHeader | layout | Navigation |
| CommunityStandardsHero | section | Hero banner |
| CommunityStandardsContent | section | Rules/standards prose content |
| SiteFooter | layout | Footer |
| WidgetButton | overlay | Floating FAB |

### Data Displayed

- Static community rules content (no entity data)

### Routes/URLs

- `/community-standards`

### Related Screens

- SCR001_HomePage (rule modal also links here)

---

## SCR007_KudosPage

**Type**: composite

### Description

Main kudos feed page at `/kudos`. Assembles three data-driven content sections (Highlight, Spotlight, AllKudos) plus shared layout. Composite classification: H3 passes (≥3 named section wrappers: `KudosHero`, `HighlightSection`, `SpotlightSection`, `AllKudosSection`); H2 passes — page imports from multiple domain namespaces (`@/components/kudos/*` domain module, distinct business concerns); H1: 4+ feature refs. Gate: H2∧H3 → composite (strong).

Each of the three primary sections has a **distinct API endpoint** and **independent loading state**, making them the primary REG split:
- HighlightSection → `GET /kudos/highlight` (filterable, own loading state, `frontend/components/kudos/highlight-section.tsx:42`)
- SpotlightSection → `GET /kudos/spotlight` + `GET /kudos/spotlight/recent` (own loading state, `frontend/components/kudos/spotlight-section.tsx:18-19`)
- AllKudosSection contains KudosFeed (`GET /kudos` paginated) + KudosSidebar (SidebarStats `GET /kudos/stats` + SidebarRecipients `GET /kudos?limit=10`)

The layout parallel route (`@modal` slot in `kudos/layout.tsx`) renders the modal overlay without a new SCR — the modal is SCR008 (intercepted route).

**Source**: `frontend/app/kudos/page.tsx`; layout: `frontend/app/kudos/layout.tsx`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| SiteHeader | layout | Navigation |
| KudosHero | section | Page hero banner |
| HighlightSection | section | Highlighted kudos carousel with hashtag/dept filters |
| SpotlightSection | section | Word cloud + recent recipients spotlight |
| AllKudosSection | section | Paginated kudos feed + sidebar stats/recipients |
| WriteKudosModal | modal | Compose and submit new kudos (POST /kudos, POST /kudos/images) |
| SiteFooter | layout | Footer |
| WidgetButton | overlay | Floating FAB — triggers WriteKudosModal |

### Data Displayed

- Kudos (highlight feed, spotlight data, all-kudos paginated feed)
- User stats (kudosReceived, kudosSent, heartsReceived)
- Recent kudos recipients list
- Hashtag list (for filters)
- Department list (for filters)

### Routes/URLs

- `/kudos`
- `/kudos/:id` (intercepted modal — see SCR008)

### Related Screens

- SCR008_KudosDetailModal (clicking a kudos card opens detail modal)
- SCR009_ProfilePage (clicking recipient avatar navigates to profile)
- SCR001_HomePage (nav)

### Regions

| Code | Label | Source File:Line | Independence Signals |
|------|-------|-----------------|---------------------|
| REG001_HighlightSection | Highlight Kudos Carousel | `frontend/components/kudos/highlight-section.tsx:42` | Own endpoint `GET /kudos/highlight`; independent loading state; own filter controls (hashtag + dept dropdowns); distinct mutation surface (like/unlike via `POST/DELETE /kudos/:id/like`) |
| REG002_SpotlightSection | Spotlight Word Cloud | `frontend/components/kudos/spotlight-section.tsx:17-20` | Own endpoints `GET /kudos/spotlight` + `GET /kudos/spotlight/recent`; independent loading state; distinct business workflow (word cloud navigation, recipient search) |
| REG003_AllKudosFeed | All Kudos Feed | `frontend/components/kudos/kudos-feed.tsx:45` | Own endpoint `GET /kudos` (paginated); independent loading state; distinct pagination/filter state; distinct mutation surface (`POST /kudos`, `POST/DELETE /kudos/:id/like`) |
| REG004_KudosSidebar | Kudos Sidebar (Stats + Recipients) | `frontend/components/kudos/kudos-sidebar.tsx:1` | Own endpoints: SidebarStats `GET /kudos/stats` + SidebarRecipients `GET /kudos?limit=10`; independent loading state; independent scroll (sticky); distinct business workflow (personal stats + secret box action) |

---

## SCR008_KudosDetailModal

**Type**: atomic

### Description

Kudos detail view. Appears as a modal overlay when navigating to `/kudos/:id` from within `/kudos` (Next.js parallel route intercept via `@modal/(.)kudos/[id]/page.tsx`). Falls back to full page rendering of KudosPage + forced modal when accessed directly via URL (`/kudos/[id]/page.tsx`). Single component (`KudosDetailModal`) — fetches `GET /kudos/:id`, displays full kudos, supports like/unlike. Atomic: single API, single loading state, single mutation surface.

**Source**: Intercepted: `frontend/app/kudos/@modal/(.)kudos/[id]/page.tsx`; Direct-URL: `frontend/app/kudos/[id]/page.tsx`; Component: `frontend/components/kudos/kudos-detail-modal.tsx:47`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| KudosDetailModal | modal | Full kudos detail: sender/receiver, message, images, hashtags, like, copy link |

### Data Displayed

- Single Kudos (id, sender, receiver, message, title, imageUrls, hashtags, likeCount, likedByMe)

### Routes/URLs

- `/kudos/:id` (intercepted from /kudos — renders as overlay)
- `/kudos/:id` (direct URL — renders KudosPage + modal forced open)

### Related Screens

- SCR007_KudosPage (parent; back navigation closes modal and returns to feed)

---

## SCR009_ProfilePage

**Type**: composite

### Description

User profile page at `/profile/:email`. Fetches `GET /kudos/profile/:email` for user data + kudos stats aggregate. Then renders profile hero, icon collection, stats box, and a paginated kudos section (sent/received filter). Composite: H3 passes (≥3 named section wrappers: `ProfileHero`, `ProfileStatsBox`, `ProfileKudosSection`); H2 fails (imports from `@/components/profile/*` — excluded UI path); H1: 4 feature refs (hero, icons, stats, kudos list). Gate: H1∧H3 → composite.

**Source**: `frontend/app/profile/[email]/page.tsx:50`

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| SiteHeader | layout | Navigation |
| ProfileHero | section | User avatar, name, department, star rank |
| ProfileIconCollection | section | Decorative icon row |
| ProfileStatsBox | section | kudosReceived / kudosSent / heartsReceived counters |
| ProfileKudosSection | section | Paginated kudos list with sent/received filter (GET /kudos?sender= or ?receiver=) |
| SiteFooter | layout | Footer |

### Data Displayed

- User (name, picture, department, stars)
- ProfileApiResponse (kudosReceived, kudosSent, heartsReceived)
- Kudos list (paginated, filterable by sent/received)

### Routes/URLs

- `/profile/:email`

### Related Screens

- SCR007_KudosPage (navigation from sidebar recipients or kudos card receiver)
- SCR008_KudosDetailModal (clicking kudos card in profile feed)

### Regions

| Code | Label | Source File:Line | Independence Signals |
|------|-------|-----------------|---------------------|
| REG001_ProfileHero | Profile Hero + Icon Collection | `frontend/components/profile/profile-hero.tsx:1` | Data from parent page load (`GET /kudos/profile/:email`); distinct visual zone; independent of kudos list |
| REG002_ProfileStats | Profile Stats Box | `frontend/components/profile/profile-stats-box.tsx:1` | Data from same parent load but distinct business workflow (aggregate stats display); distinct validation path (shows loading/error independently at page level) |
| REG003_ProfileKudosList | Profile Kudos List | `frontend/components/profile/profile-kudos-section.tsx:65` | Own endpoint `GET /kudos?sender={email}` or `?receiver={email}` (paginated); independent loading state; independent filter state (sent/received); distinct pagination surface; distinct mutation surface (`POST/DELETE /kudos/:id/like`) |

---

## Summary

- **Total Screens**: 9
- **Composite Screens**: 4 (SCR001, SCR005, SCR007, SCR009)
- **Atomic Screens**: 5 (SCR002, SCR003, SCR004, SCR006, SCR008)
- **Total Regions**: 12 (SCR001: 3, SCR005: 2, SCR007: 4, SCR009: 3)

---

## Composite Detection Notes

| SCR | H1 | H2 | H3 | Gate Result | Notes |
|-----|----|----|----|-------------|-------|
| SCR001_HomePage | pass (3 refs) | fail | pass (3 sections) | H1∧H3 → composite | |
| SCR002_LoginPage | fail (2) | fail | fail (2) | all fail → atomic | |
| SCR003_AuthCallback | fail | fail | fail | all fail → atomic | single-purpose redirect handler |
| SCR004_CountdownPage | fail | fail | fail | all fail → atomic | single component |
| SCR005_AwardsPage | pass (3) | fail | pass (3 sections) | H1∧H3 → composite | |
| SCR006_CommunityStandardsPage | fail (2) | fail | fail (2) | all fail → atomic | |
| SCR007_KudosPage | pass (4+) | pass (kudos domain module) | pass (4+ sections) | H2∧H3 → composite (strong) | |
| SCR008_KudosDetailModal | fail | fail | fail | all fail → atomic | single modal component |
| SCR009_ProfilePage | pass (4) | fail | pass (3 sections) | H1∧H3 → composite | |

H6 check: No screen is a pure router outlet. `kudos/layout.tsx` renders `{children}{modal}` — this is a parallel route shell, not an H6 outlet (no distinct URL path segments for the layout itself; children are SCR007 and SCR008). H4 check: No tab-based mutual-exclusion UI found; `ProfileKudosSection` filter is a `<select>` modifying query params on same endpoint (not H4 tabs). H5 check: No wizard/stepper pattern found.

---

## Cross-Reference Validation

- [x] All SCR### codes are unique
- [x] Each SCR### has a route from RouteList
- [x] All REG### carry ≥1 independence signal (Trap 1 compliance)
- [x] No tab (H4) or wizard (H5) signals misclassified as REG
- [x] No H6 router-outlet grouping violations
- [x] No SCR### variants (a/b) needed — no H4/H5 cases found
- [x] UserStory mapping is pending (Wave 4)
- [x] FeatureList mapping is pending (Wave 5)
