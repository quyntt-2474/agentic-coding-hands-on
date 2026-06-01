# User Stories

**Project**: Sun* Kudos
**Generated**: 2026-06-01
**Analysis Scope**: 9 screens (SCR001–SCR009), 13 regions, 17 backend routes, 0 background logic items

**Code Format**: All US codes follow `US###_NameSlug` format (e.g., US001_Login)

**US Types**:
- `ui` — User-facing stories (require Screen mapping)
- `system` — System stories: hook, event, observer, bg-job, trigger, etc. (no Screen mapping needed)

**Note**: Feature mapping is managed in FeatureList.md only. This document contains user stories without direct feature references. UI US require Screen mapping; system/bg-job US do not. `ui`-typed stories may map to `SCR###` or `SCR###/REG###`; non-`ui` types map to `SCR###` only (or omit). No `system` US exist — background-logic.md confirmed 0 BL items.

---

## Interaction Inventory

> Complete this table BEFORE writing any US. One row per interactive element per screen.
> Source of truth for US count — every row maps to ≥1 US below (unless merge exception applies).
> See: references/user-stories-ipe-protocol.md for enumeration rules and merge exception.

| Screen | Element | Type | Action | Endpoint |
|--------|---------|------|--------|---------|
| SCR002_LoginPage | "Sign in with Google" button | primary-action | Initiates Google OAuth flow; browser navigates to backend redirect | GET /auth/google |
| SCR003_AuthCallback | Token extraction + redirect | primary-action | Reads `?token=` param, stores in localStorage, redirects to `/` | N/A (client-only) |
| SCR001_HomePage/REG001_HeroBand | "About Awards" CTA link | navigation | Navigate to /awards | N/A |
| SCR001_HomePage/REG001_HeroBand | "About Kudos" CTA link | navigation | Navigate to /kudos | N/A |
| SCR001_HomePage | WidgetButton FAB (expand) | secondary-action | Expands FAB menu revealing "Thể lệ" and "Viết KUDOS" options | N/A |
| SCR001_HomePage | WidgetButton → "Thể lệ" | secondary-action | Opens RuleModal (community standards inline dialog) | N/A |
| SCR001_HomePage | WidgetButton → "Viết KUDOS" | navigation | Navigate to /kudos | N/A |
| SCR001_HomePage | SiteHeader — logo link | navigation | Navigate to / (home) | N/A |
| SCR001_HomePage | SiteHeader — nav links (About SAA / Awards / Kudos) | navigation | Navigate to respective page | N/A |
| SCR001_HomePage | SiteHeader — UserProfileDropdown → "Profile" | navigation | Navigate to /profile/:email | N/A |
| SCR001_HomePage | SiteHeader — UserProfileDropdown → "Logout" | destructive-action | Remove auth_token from localStorage, redirect to /login | N/A |
| SCR001_HomePage | SiteHeader — NotificationPanel toggle | secondary-action | Opens/closes notification panel dropdown | N/A |
| SCR001_HomePage | SiteHeader — Language selector | secondary-action | Toggles UI language (VN/EN) | N/A |
| SCR004_CountdownPage | Static display (no interactive elements) | — | Read-only countdown page | N/A |
| SCR005_AwardsPage/REG001_AwardDetailSection | Award mobile horizontal nav click | secondary-action | Scrolls to selected award card | N/A |
| SCR005_AwardsPage/REG001_AwardDetailSection | Award sticky desktop nav click | secondary-action | Scrolls to selected award card | N/A |
| SCR005_AwardsPage/REG002_KudosCTA | "Go to Kudos" CTA link | navigation | Navigate to /kudos | N/A |
| SCR006_CommunityStandardsPage | Static content (no interactive elements) | — | Read-only rules page | N/A |
| SCR007_KudosPage/REG001_HighlightSection | Hashtag filter dropdown | secondary-action | Filters highlight feed by hashtag; refetches | GET /kudos/highlight?hashtag=X |
| SCR007_KudosPage/REG001_HighlightSection | Department filter dropdown | secondary-action | Filters highlight feed by department; refetches | GET /kudos/highlight?department=X |
| SCR007_KudosPage/REG001_HighlightSection | Carousel prev/next navigation | secondary-action | Advances/retreats carousel to next/prev card | N/A (client-only) |
| SCR007_KudosPage/REG001_HighlightSection | Like/unlike button on kudos card | primary-action | Toggles like on a kudos (POST or DELETE) | POST /kudos/:id/like or DELETE /kudos/:id/like |
| SCR007_KudosPage/REG002_SpotlightSection | Name search input | secondary-action | Filters word cloud by recipient name (client-side) | N/A (client filter on loaded data) |
| SCR007_KudosPage/REG002_SpotlightSection | Word cloud name hover → hover card | secondary-action | Fetches and shows recipient hover card | GET /kudos/recipient/:email/profile |
| SCR007_KudosPage/REG002_SpotlightSection | Hover card "Gửi KUDO" button | primary-action | Opens WriteKudosModal with recipient pre-filled | N/A (modal trigger) |
| SCR007_KudosPage/REG003_AllKudosFeed | Write kudos trigger bar (left half) | primary-action | Opens WriteKudosModal (blank) | N/A (modal trigger) |
| SCR007_KudosPage/REG003_AllKudosFeed | Search Sunner bar (right half) | secondary-action | Opens user search; selecting opens WriteKudosModal with recipient pre-filled | GET /users?search=X |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — recipient search input | secondary-action | Searches users by name/email | GET /users?search=X |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — title input | secondary-action | Enters badge/title text | N/A |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — rich-text editor | secondary-action | Composes message with Tiptap (bold/italic/link/blockquote) | N/A |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — image upload | secondary-action | Uploads image to S3 and attaches key | POST /kudos/images |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — remove image | destructive-action | Removes attached image from form | N/A (client-only) |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — hashtag selector | secondary-action | Selects hashtags from list | GET /hashtags |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — anonymous toggle | secondary-action | Marks kudos as anonymous; reveals alias input | N/A |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — Send (submit) button | primary-action | Submits kudos form | POST /kudos |
| SCR007_KudosPage/REG003_AllKudosFeed | WriteKudosModal — Cancel button | secondary-action | Closes modal without submitting | N/A |
| SCR007_KudosPage/REG003_AllKudosFeed | "Load More" button (kudos feed) | secondary-action | Appends next page of kudos to feed | GET /kudos?page=N |
| SCR007_KudosPage/REG003_AllKudosFeed | Like/unlike button on feed card | primary-action | Toggles like on a kudos | POST /kudos/:id/like or DELETE /kudos/:id/like |
| SCR007_KudosPage/REG003_AllKudosFeed | Copy link button on feed card | secondary-action | Copies kudos permalink to clipboard | N/A |
| SCR007_KudosPage/REG004_KudosSidebar | "Open Secret Box" button | primary-action | Triggers secret box unlock (gated: kudosReceived ≥ 5) | N/A (threshold gated, toast only) |
| SCR007_KudosPage/REG004_KudosSidebar | Recent recipient link | navigation | Navigate to /profile/:email | N/A |
| SCR008_KudosDetailModal | Close button (✕) | navigation | Closes modal; navigates back or to /kudos | N/A |
| SCR008_KudosDetailModal | Like/unlike button | primary-action | Toggles like on the displayed kudos | POST /kudos/:id/like or DELETE /kudos/:id/like |
| SCR008_KudosDetailModal | Copy Link button | secondary-action | Copies kudos permalink to clipboard | N/A |
| SCR009_ProfilePage/REG003_ProfileKudosList | Sent/Received filter dropdown | secondary-action | Switches kudos list between sent and received | GET /kudos?sender= or ?receiver= |
| SCR009_ProfilePage/REG003_ProfileKudosList | "Load More" button (profile kudos) | secondary-action | Appends next page of kudos | GET /kudos?sender=&page=N |
| SCR009_ProfilePage/REG003_ProfileKudosList | Like/unlike button on profile kudos card | primary-action | Toggles like on a kudos | POST /kudos/:id/like or DELETE /kudos/:id/like |
| SCR009_ProfilePage/REG003_ProfileKudosList | Copy link button on profile kudos card | secondary-action | Copies kudos permalink to clipboard | N/A |

**Merge notes**:
- Like (POST) and unlike (DELETE) on the same screen/region are merged into one US each because they share the same actor, same surface, and represent a toggle interaction (the endpoint differs only by method; the UI toggle is the same affordance). Separate where regions are truly distinct surfaces.
- "Copy link" on kudos feed card (SCR007/REG003) and on kudos detail modal (SCR008) are separate surfaces → separate US.
- Language selector is a global UX affordance present on every page via SiteHeader — single US, maps to all applicable screens.
- Notification panel has no data beyond "no notifications" state — single secondary-action US.

---

## User Story Index

| Code | Title | Type | Priority | Screens |
|------|-------|------|----------|---------|
| US001_SignInWithGoogle | Sign In with Google | ui | high | SCR002_LoginPage |
| US002_CompleteOAuthCallback | Complete OAuth Callback | ui | high | SCR003_AuthCallback |
| US003_NavigateToAwardsFromHero | Navigate to Awards from Hero | ui | medium | SCR001_HomePage/REG001_HeroBand |
| US004_NavigateToKudosFromHero | Navigate to Kudos from Hero | ui | medium | SCR001_HomePage/REG001_HeroBand |
| US005_OpenRuleModalFromWidget | Open Community Rules Modal from Widget | ui | medium | SCR001_HomePage |
| US006_NavigateToKudosFromWidget | Navigate to Kudos from Widget | ui | medium | SCR001_HomePage |
| US007_NavigateToProfileFromHeader | Navigate to Own Profile from Header | ui | medium | SCR001_HomePage, SCR005_AwardsPage, SCR006_CommunityStandardsPage, SCR007_KudosPage, SCR009_ProfilePage |
| US008_LogOut | Log Out | ui | high | SCR001_HomePage, SCR005_AwardsPage, SCR006_CommunityStandardsPage, SCR007_KudosPage, SCR009_ProfilePage |
| US009_ToggleLanguage | Toggle UI Language | ui | low | SCR001_HomePage, SCR002_LoginPage, SCR005_AwardsPage, SCR006_CommunityStandardsPage, SCR007_KudosPage, SCR009_ProfilePage |
| US010_ViewNotificationPanel | View Notification Panel | ui | low | SCR001_HomePage, SCR005_AwardsPage, SCR007_KudosPage, SCR009_ProfilePage |
| US011_ViewCountdownPage | View Pre-launch Countdown | ui | low | SCR004_CountdownPage |
| US012_NavigateAwardDetails | Navigate to Award Detail Section | ui | low | SCR005_AwardsPage/REG001_AwardDetailSection |
| US013_NavigateToKudosFromAwardsCTA | Navigate to Kudos from Awards CTA | ui | low | SCR005_AwardsPage/REG002_KudosCTA |
| US014_ViewCommunityStandards | View Community Standards Page | ui | low | SCR006_CommunityStandardsPage |
| US015_FilterHighlightByHashtag | Filter Highlight Feed by Hashtag | ui | medium | SCR007_KudosPage/REG001_HighlightSection |
| US016_FilterHighlightByDepartment | Filter Highlight Feed by Department | ui | medium | SCR007_KudosPage/REG001_HighlightSection |
| US017_LikeKudosFromHighlight | Toggle Like on a Kudos from Highlight | ui | high | SCR007_KudosPage/REG001_HighlightSection |
| US018_SearchRecipientInSpotlight | Search Recipient in Spotlight Word Cloud | ui | medium | SCR007_KudosPage/REG002_SpotlightSection |
| US019_ViewRecipientHoverCard | View Recipient Hover Card in Spotlight | ui | medium | SCR007_KudosPage/REG002_SpotlightSection |
| US020_SendKudosFromSpotlightHoverCard | Send Kudos from Spotlight Hover Card | ui | medium | SCR007_KudosPage/REG002_SpotlightSection |
| US021_OpenWriteKudosModal | Open Write Kudos Modal | ui | high | SCR007_KudosPage/REG003_AllKudosFeed |
| US022_SearchRecipientInKudosTrigger | Search Recipient via Kudos Bar Search | ui | medium | SCR007_KudosPage/REG003_AllKudosFeed |
| US023_SelectRecipientInModal | Select Recipient in Write Kudos Modal | ui | high | SCR007_KudosPage/REG003_AllKudosFeed |
| US024_UploadImageInModal | Upload Image in Write Kudos Modal | ui | medium | SCR007_KudosPage/REG003_AllKudosFeed |
| US025_RemoveImageFromModal | Remove Uploaded Image from Modal | ui | low | SCR007_KudosPage/REG003_AllKudosFeed |
| US026_ToggleAnonymousInModal | Toggle Anonymous Mode in Write Kudos Modal | ui | medium | SCR007_KudosPage/REG003_AllKudosFeed |
| US027_SubmitKudos | Submit Kudos | ui | high | SCR007_KudosPage/REG003_AllKudosFeed |
| US028_LoadMoreKudosFeed | Load More Kudos in All Kudos Feed | ui | medium | SCR007_KudosPage/REG003_AllKudosFeed |
| US029_LikeKudosFromFeed | Toggle Like on a Kudos from All Kudos Feed | ui | high | SCR007_KudosPage/REG003_AllKudosFeed |
| US030_CopyKudosLinkFromFeed | Copy Kudos Link from Feed Card | ui | low | SCR007_KudosPage/REG003_AllKudosFeed |
| US031_UnlockSecretBox | Unlock Secret Box | ui | medium | SCR007_KudosPage/REG004_KudosSidebar |
| US032_NavigateToRecipientProfileFromSidebar | Navigate to Recipient Profile from Sidebar | ui | medium | SCR007_KudosPage/REG004_KudosSidebar |
| US033_LikeKudosFromDetailModal | Toggle Like on a Kudos from Detail Modal | ui | high | SCR008_KudosDetailModal |
| US034_CopyKudosLinkFromDetailModal | Copy Kudos Link from Detail Modal | ui | low | SCR008_KudosDetailModal |
| US035_CloseKudosDetailModal | Close Kudos Detail Modal | ui | medium | SCR008_KudosDetailModal |
| US036_FilterProfileKudosBySentReceived | Filter Profile Kudos by Sent or Received | ui | medium | SCR009_ProfilePage/REG003_ProfileKudosList |
| US037_LoadMoreProfileKudos | Load More Kudos on Profile Page | ui | medium | SCR009_ProfilePage/REG003_ProfileKudosList |
| US038_LikeKudosFromProfileFeed | Toggle Like on a Kudos from Profile Feed | ui | high | SCR009_ProfilePage/REG003_ProfileKudosList |
| US039_CopyKudosLinkFromProfileFeed | Copy Kudos Link from Profile Feed Card | ui | low | SCR009_ProfilePage/REG003_ProfileKudosList |

---

## US001_SignInWithGoogle: Sign In with Google

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 1 point

### User Story

As a visitor, I want to sign in with Google so that I can access the Sun* Kudos platform.

### Acceptance Criteria

- [ ] Clicking "Sign in with Google" button on the login page navigates the browser to `GET /auth/google` (backend Google OAuth redirect).
- [ ] If `auth_token` is already present in localStorage, the page redirects to `/` without showing the login UI.
- [ ] The button is visible and clickable on both VN and EN language modes.

### Technical Notes

- **Endpoint**: GET /auth/google (backend redirect, not a direct API call from frontend)
- **Data Required**: None — Google OAuth handles identity
- **Dependencies**: PERM002_BackendGoogleOAuthGuard, SCR003_AuthCallback (receives token after redirect)

### Screens

- SCR002_LoginPage: Login Page

### Background Logic

_(none — 0 BL items in this project)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User has no `auth_token`; is on /login | Clicks "Sign in with Google" | Browser navigates to `/auth/google`; Google consent screen appears |
| Already Authed | User has valid `auth_token` in localStorage | Visits /login | Redirect to `/` without showing login UI |

---

## US002_CompleteOAuthCallback: Complete OAuth Callback

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 1 point

### User Story

As a visitor completing Google sign-in, I want the app to store my authentication token automatically so that I am redirected to the home page without manual action.

### Acceptance Criteria

- [ ] Page at `/auth/callback` reads the `token` query parameter from the URL.
- [ ] Token is persisted to `localStorage` under key `auth_token`.
- [ ] User is redirected to `/` after token is stored.
- [ ] A loading spinner is displayed during the token extraction and redirect.
- [ ] If no `token` param is present, user is still redirected (graceful fallback).

### Technical Notes

- **Endpoint**: N/A (client-only; no API call — token arrives as URL query param)
- **Data Required**: `?token=<jwt>` query param from backend redirect
- **Dependencies**: PERM003_FrontendAuthGuard (reads the stored token on subsequent navigation)

### Screens

- SCR003_AuthCallback: Auth Callback

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Backend redirects to `/auth/callback?token=<valid_jwt>` | Page mounts | Token stored in localStorage; user redirected to `/` |
| Missing Token | URL is `/auth/callback` with no `token` param | Page mounts | User is redirected (no crash); no token stored |

---

## US003_NavigateToAwardsFromHero: Navigate to Awards from Hero

**Type**: ui
**Interaction**: navigation
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to navigate to the Awards page from the home page hero so that I can read about the award categories and prizes.

### Acceptance Criteria

- [ ] "About Awards" CTA button in HeroSection links to `/awards`.
- [ ] Navigation preserves authentication state (no re-login required).

### Technical Notes

- **Endpoint**: N/A (client-side navigation)
- **Data Required**: None
- **Dependencies**: PERM003_FrontendAuthGuard (auth-required destination)

### Screens

- SCR001_HomePage/REG001_HeroBand: Hero + Event Info Band

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user is on `/` | Clicks "About Awards" CTA | Browser navigates to `/awards`; Awards page renders |

---

## US004_NavigateToKudosFromHero: Navigate to Kudos from Hero

**Type**: ui
**Interaction**: navigation
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to navigate to the Kudos page from the home page hero so that I can view and send kudos.

### Acceptance Criteria

- [ ] "About Kudos" CTA button in HeroSection links to `/kudos`.
- [ ] Navigation preserves authentication state.

### Technical Notes

- **Endpoint**: N/A (client-side navigation)
- **Data Required**: None
- **Dependencies**: PERM003_FrontendAuthGuard

### Screens

- SCR001_HomePage/REG001_HeroBand: Hero + Event Info Band

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user is on `/` | Clicks "About Kudos" CTA | Browser navigates to `/kudos`; Kudos page renders |

---

## US005_OpenRuleModalFromWidget: Open Community Rules Modal from Widget

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to open the community rules modal from the floating widget button so that I can review the participation guidelines without leaving the page.

### Acceptance Criteria

- [ ] Clicking the floating WidgetButton expands a menu with "Thể lệ" and "Viết KUDOS" options.
- [ ] Clicking "Thể lệ" opens the `RuleModal` dialog inline.
- [ ] The `RuleModal` contains community standards content.
- [ ] The modal can be closed; the underlying page remains in its prior state.

### Technical Notes

- **Endpoint**: N/A (static modal content, no API call)
- **Data Required**: None
- **Dependencies**: SCR006_CommunityStandardsPage (same content, different surface)

### Screens

- SCR001_HomePage: Home Page

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User is on homepage with WidgetButton visible | Clicks FAB, then "Thể lệ" | RuleModal opens with community standards content |
| Close Modal | RuleModal is open | Clicks close / outside modal | Modal closes; page state unchanged |

---

## US006_NavigateToKudosFromWidget: Navigate to Kudos from Widget

**Type**: ui
**Interaction**: navigation
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to navigate to the Kudos page from the floating widget button so that I can quickly reach the kudos writing flow.

### Acceptance Criteria

- [ ] Expanding the WidgetButton and clicking "Viết KUDOS" navigates to `/kudos`.
- [ ] Navigation preserves authentication state.

### Technical Notes

- **Endpoint**: N/A (client-side navigation via `router.push('/kudos')`)
- **Data Required**: None
- **Dependencies**: PERM003_FrontendAuthGuard

### Screens

- SCR001_HomePage: Home Page

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User is on homepage | Expands FAB, clicks "Viết KUDOS" | Navigates to `/kudos` |

---

## US007_NavigateToProfileFromHeader: Navigate to Own Profile from Header

**Type**: ui
**Interaction**: navigation
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to navigate to my own profile page from the header dropdown so that I can view my kudos stats and history.

### Acceptance Criteria

- [ ] Clicking the user avatar in the header opens a dropdown menu with "Profile" and "Logout" options.
- [ ] Clicking "Profile" navigates to `/profile/<currentUserEmail>`.
- [ ] The profile page loads with the current user's data.

### Technical Notes

- **Endpoint**: GET /kudos/profile/:email (called by ProfilePage on load)
- **Data Required**: `user.email` from JWT payload in localStorage
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM003_FrontendAuthGuard

### Screens

- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user on any auth-required page | Opens header dropdown, clicks "Profile" | Navigates to `/profile/<email>`; own profile loads |

---

## US008_LogOut: Log Out

**Type**: ui
**Interaction**: destructive-action
**Priority**: high
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to log out so that my session is terminated and no other person using my device can access my account.

### Acceptance Criteria

- [ ] Clicking "Logout" in the header dropdown removes `auth_token` from localStorage.
- [ ] User is redirected to `/login` immediately after logout.
- [ ] After logout, navigating to any auth-required route redirects back to `/login`.
- [ ] No API call is made on logout (client-side only token removal).

### Technical Notes

- **Endpoint**: N/A (client-side only — `localStorage.removeItem('auth_token')` + `router.replace('/login')`)
- **Data Required**: None
- **Dependencies**: PERM003_FrontendAuthGuard (re-enforces guard on next navigation)

### Screens

- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user on any page | Opens header dropdown, clicks "Logout" | `auth_token` removed; redirected to `/login` |
| Guard Check | After logout | Manually navigates to `/kudos` | Redirected to `/login` |

---

## US009_ToggleLanguage: Toggle UI Language

**Type**: ui
**Interaction**: secondary-action
**Priority**: low
**Estimate**: 1 point

### User Story

As a user, I want to switch the interface language between Vietnamese and English so that I can read the app in my preferred language.

### Acceptance Criteria

- [ ] Language selector is visible on the login page and in the header on all auth-required pages.
- [ ] Selecting a language immediately updates all visible UI text (i18n).
- [ ] Language preference persists across page navigations within the session.

### Technical Notes

- **Endpoint**: N/A (client-side i18n via `lib/i18n.ts`)
- **Data Required**: None
- **Dependencies**: `LanguageSelector` component; `useTranslations` hook

### Screens

- SCR001_HomePage: Home Page
- SCR002_LoginPage: Login Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| VN → EN | UI is in Vietnamese | Selects English in language selector | All labels switch to English |
| EN → VN | UI is in English | Selects Vietnamese | All labels switch to Vietnamese |

---

## US010_ViewNotificationPanel: View Notification Panel

**Type**: ui
**Interaction**: secondary-action
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to open the notification panel so that I can check whether I have any new notifications.

### Acceptance Criteria

- [ ] Clicking the notification bell icon in the header opens a dropdown panel.
- [ ] Panel currently shows an empty state message (no notifications yet).
- [ ] Clicking outside the panel closes it.

### Technical Notes

- **Endpoint**: N/A (no notification API endpoint exists; panel shows static empty state)
- **Data Required**: None
- **Dependencies**: None

### Screens

- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Open | Authenticated user | Clicks bell icon | Notification panel opens showing empty state |
| Close | Panel is open | Clicks outside panel | Panel closes |

---

## US011_ViewCountdownPage: View Pre-launch Countdown

**Type**: ui
**Interaction**: navigation
**Priority**: low
**Estimate**: 1 point

### User Story

As any visitor, I want to view the pre-launch countdown page so that I can see how long until the Sun* Annual Awards event.

### Acceptance Criteria

- [ ] Page at `/countdown` is publicly accessible (no auth required).
- [ ] A live countdown timer counts down to the hardcoded event date.
- [ ] Static event information (date, venue) is displayed.

### Technical Notes

- **Endpoint**: N/A (static client-side countdown)
- **Data Required**: Hardcoded event date in client code
- **Dependencies**: PERM003_FrontendAuthGuard (PUBLIC_PATHS includes `/countdown`)

### Screens

- SCR004_CountdownPage: Countdown / Pre-launch

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Any visitor (unauthenticated) | Navigates to `/countdown` | Countdown page renders with live timer; no redirect to login |

---

## US012_NavigateAwardDetails: Navigate to Award Detail Section

**Type**: ui
**Interaction**: secondary-action
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee on the Awards page, I want to jump to a specific award section by clicking its name in the navigation so that I can read its details without manual scrolling.

### Acceptance Criteria

- [ ] Desktop: sticky sidebar nav shows all 6 award names; clicking one scrolls the page to that award's card.
- [ ] Mobile: horizontal nav at top shows all 6 award names; clicking one scrolls to that award's card.
- [ ] Active award is visually highlighted in the nav.

### Technical Notes

- **Endpoint**: N/A (client-side scroll only)
- **Data Required**: 6 award items (static i18n)
- **Dependencies**: None

### Screens

- SCR005_AwardsPage/REG001_AwardDetailSection: Award Detail Cards + Sticky Nav

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Desktop Nav | User on `/awards`, desktop viewport | Clicks award name in sticky sidebar | Page scrolls to that award card; nav item highlighted |
| Mobile Nav | User on `/awards`, mobile viewport | Taps award name in horizontal nav | Page scrolls to that award card |

---

## US013_NavigateToKudosFromAwardsCTA: Navigate to Kudos from Awards CTA

**Type**: ui
**Interaction**: navigation
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee on the Awards page, I want to navigate to the Kudos page from the CTA band so that I can send kudos to a colleague.

### Acceptance Criteria

- [ ] The Kudos CTA band at the bottom of the Awards page contains a link to `/kudos`.
- [ ] Navigation preserves authentication state.

### Technical Notes

- **Endpoint**: N/A
- **Data Required**: None
- **Dependencies**: PERM003_FrontendAuthGuard

### Screens

- SCR005_AwardsPage/REG002_KudosCTA: Kudos CTA Band

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User on `/awards` | Clicks Kudos CTA link | Navigates to `/kudos` |

---

## US014_ViewCommunityStandards: View Community Standards Page

**Type**: ui
**Interaction**: navigation
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to view the community standards page so that I can understand the participation rules before sending kudos.

### Acceptance Criteria

- [ ] Page at `/community-standards` is accessible to authenticated users.
- [ ] Hero banner and static rules/standards content are rendered.
- [ ] Page renders without API calls (static content only).

### Technical Notes

- **Endpoint**: N/A (static content page)
- **Data Required**: None
- **Dependencies**: PERM003_FrontendAuthGuard

### Screens

- SCR006_CommunityStandardsPage: Community Standards

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user | Navigates to `/community-standards` | Page renders with hero and rules content |
| Unauthenticated | No `auth_token` | Navigates to `/community-standards` | Redirected to `/login` |

---

## US015_FilterHighlightByHashtag: Filter Highlight Feed by Hashtag

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 2 points

### User Story

As an authenticated employee, I want to filter the highlighted kudos by hashtag so that I can focus on kudos related to a specific theme or category.

### Acceptance Criteria

- [ ] A hashtag filter dropdown is present in the HighlightSection header row.
- [ ] Selecting a hashtag refetches `GET /kudos/highlight?hashtag=<name>` and updates the carousel.
- [ ] Clearing the filter (selecting "All") resets the carousel to unfiltered results.
- [ ] Loading state is shown while the filtered data is being fetched.

### Technical Notes

- **Endpoint**: GET /kudos/highlight?hashtag=X
- **Data Required**: `GET /hashtags` (populates dropdown options)
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User on `/kudos`; hashtags loaded | Selects a hashtag from dropdown | Carousel refetches and shows only kudos with that hashtag |
| Clear Filter | Hashtag filter is active | Selects "All" / clears selection | Carousel resets to all highlighted kudos |

---

## US016_FilterHighlightByDepartment: Filter Highlight Feed by Department

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 2 points

### User Story

As an authenticated employee, I want to filter the highlighted kudos by department so that I can see recognition within a specific team.

### Acceptance Criteria

- [ ] A department filter dropdown is present in the HighlightSection header row.
- [ ] Selecting a department refetches `GET /kudos/highlight?department=<name>` and updates the carousel.
- [ ] Hashtag and department filters are independent and can be applied simultaneously.
- [ ] Loading state is shown during refetch.

### Technical Notes

- **Endpoint**: GET /kudos/highlight?department=X (or combined: ?hashtag=X&department=Y)
- **Data Required**: `GET /departments` (populates dropdown options)
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User on `/kudos`; departments loaded | Selects a department from dropdown | Carousel refetches and shows only kudos from that department |
| Combined Filter | Hashtag filter already active | Also selects a department | Both filters applied; query is `?hashtag=X&department=Y` |

---

## US017_LikeKudosFromHighlight: Toggle Like on a Kudos from Highlight

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 2 points

### User Story

As an authenticated employee, I want to like or unlike a kudos from the highlight carousel so that I can express appreciation for recognized colleagues.

### Acceptance Criteria

- [ ] Each kudos card in the highlight carousel displays a like count and a heart icon.
- [ ] Clicking the heart when not yet liked sends `POST /kudos/:id/like`; like count increments optimistically.
- [ ] Clicking the heart when already liked sends `DELETE /kudos/:id/like`; like count decrements optimistically.
- [ ] If the API call fails, the optimistic update is rolled back.
- [ ] A user cannot like the same kudos twice (409 Conflict is handled gracefully; no visible error for optimistic toggle).
- [ ] Anonymous kudos show a masked sender but like/unlike still works.

### Technical Notes

- **Endpoint**: POST /kudos/:id/like or DELETE /kudos/:id/like
- **Data Required**: `kudos.id`, `kudos.likedByMe`, `kudos.likeCount`, current user email (from JWT)
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM006_LikeUniquenessConstraint

### Screens

- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Like | Authenticated user; `likedByMe=false` | Clicks heart on a card | Heart filled; count +1; POST /kudos/:id/like called |
| Unlike | Authenticated user; `likedByMe=true` | Clicks heart again | Heart unfilled; count -1; DELETE /kudos/:id/like called |
| API Failure | Network error | Clicks heart | Optimistic update reversed; count returns to original |

---

## US018_SearchRecipientInSpotlight: Search Recipient in Spotlight Word Cloud

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to search for a recipient by name in the spotlight word cloud so that I can quickly find a specific colleague in the visual display.

### Acceptance Criteria

- [ ] A search input is present in the SpotlightSection.
- [ ] Typing filters the word cloud to show only names matching the query (client-side filter on loaded data).
- [ ] Clearing the input restores the full word cloud.

### Technical Notes

- **Endpoint**: N/A (client-side filter; data already loaded via GET /kudos/spotlight)
- **Data Required**: `SpotlightWord[]` already in component state
- **Dependencies**: None

### Screens

- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Word cloud loaded with names | Types a name substring | Cloud filters to show only matching names |
| Clear | Filter active | Clears input | Full word cloud restored |

---

## US019_ViewRecipientHoverCard: View Recipient Hover Card in Spotlight

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 2 points

### User Story

As an authenticated employee, I want to hover over a recipient's name in the spotlight word cloud so that I can see their profile summary before deciding to send them kudos.

### Acceptance Criteria

- [ ] Hovering a name in the word cloud fetches `GET /kudos/recipient/:email/profile` and shows a floating card.
- [ ] Card shows avatar, name, department, kudos stats, and a "Gửi KUDO" button.
- [ ] A skeleton loading state is shown while the profile is being fetched.
- [ ] The card disappears when the user moves the mouse away from both the name and the card.

### Technical Notes

- **Endpoint**: GET /kudos/recipient/:email/profile (no JwtAuthGuard — public endpoint per PERM007)
- **Data Required**: `RecipientProfile` (name, picture, department, kudosReceived, kudosSent)
- **Dependencies**: PERM007_PublicSpotlightAccess

### Screens

- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Word cloud loaded | Hovers over a name | Profile card fetched and shown with avatar, name, stats |
| Loading | Network is slow | Hovers over a name | Skeleton card shown until data arrives |
| Mouse Away | Hover card is visible | Moves mouse away from name and card | Card disappears |

---

## US020_SendKudosFromSpotlightHoverCard: Send Kudos from Spotlight Hover Card

**Type**: ui
**Interaction**: primary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee viewing a spotlight hover card, I want to click "Gửi KUDO" so that the Write Kudos modal opens with that recipient pre-filled.

### Acceptance Criteria

- [ ] Clicking "Gửi KUDO" on the hover card opens the `WriteKudosModal` with the recipient field populated.
- [ ] The recipient field in the modal cannot be cleared (pre-filled context).
- [ ] User can complete and submit the kudos form normally.

### Technical Notes

- **Endpoint**: N/A (modal trigger; eventual POST /kudos on submit — covered by US027)
- **Data Required**: Recipient email/name from hover card profile
- **Dependencies**: US027_SubmitKudos

### Screens

- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Hover card is open showing recipient | Clicks "Gửi KUDO" | WriteKudosModal opens with recipient pre-filled |

---

## US021_OpenWriteKudosModal: Open Write Kudos Modal

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to open the write kudos modal by clicking the kudos input trigger so that I can compose and send a kudos.

### Acceptance Criteria

- [ ] Clicking the write kudos trigger bar (left half of `KudosInputTrigger`) opens `WriteKudosModal` with no pre-filled recipient.
- [ ] Modal is scrollable on small screens.
- [ ] Modal can be closed by clicking the Cancel button, the backdrop, or pressing Escape.

### Technical Notes

- **Endpoint**: N/A (modal open trigger; write/submit is US027)
- **Data Required**: None for modal open
- **Dependencies**: None

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user on `/kudos` | Clicks write kudos trigger | WriteKudosModal opens with empty recipient |
| Close via ESC | Modal is open | Presses Escape key | Modal closes; feed unchanged |
| Close via Backdrop | Modal is open | Clicks outside the modal card | Modal closes |

---

## US022_SearchRecipientInKudosTrigger: Search Recipient via Kudos Bar Search

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 2 points

### User Story

As an authenticated employee, I want to search for a colleague using the search bar in the kudos input area so that I can open the write kudos modal with that person already selected as recipient.

### Acceptance Criteria

- [ ] Clicking the search bar (right half of `KudosInputTrigger`) expands it into a live search input.
- [ ] Typing queries `GET /users?search=<term>` (debounced 300ms) and shows a dropdown of matching users.
- [ ] Empty query shows all users.
- [ ] Selecting a user closes the dropdown and opens `WriteKudosModal` with that user as pre-filled recipient.
- [ ] Pressing Escape collapses the search bar.

### Technical Notes

- **Endpoint**: GET /users?search=X
- **Data Required**: `UserSearchResult[]` (name, email, department, picture)
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Search + Select | User clicks search bar | Types partial name | Dropdown shows matching users; selecting one opens modal with recipient pre-filled |
| Empty Query | Search bar expanded | No text entered | All users shown in dropdown |
| ESC Collapse | Search bar is expanded | Presses Escape | Search bar collapses without opening modal |

---

## US023_SelectRecipientInModal: Select Recipient in Write Kudos Modal

**Type**: ui
**Interaction**: secondary-action
**Priority**: high
**Estimate**: 2 points

### User Story

As an authenticated employee composing a kudos, I want to search and select a recipient in the Write Kudos modal so that the kudos is addressed to the correct person.

### Acceptance Criteria

- [ ] Recipient search field in modal queries `GET /users?search=<term>` debounced 300ms.
- [ ] Empty query loads all users.
- [ ] Selecting a user populates the field with a chip showing their name and avatar.
- [ ] Clicking ✕ on the chip clears the selection.
- [ ] Recipient field shows a red border + error message if form is submitted without a recipient.

### Technical Notes

- **Endpoint**: GET /users?search=X
- **Data Required**: `UserSearchResult[]`
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Select Recipient | Modal is open, recipient field empty | Types name, selects from dropdown | Chip with name/avatar shown in field |
| Clear Recipient | Recipient chip is shown | Clicks ✕ on chip | Field cleared; chip removed |
| Validation | Form submitted without recipient | Clicks Send | Error message shown on recipient field |

---

## US024_UploadImageInModal: Upload Image in Write Kudos Modal

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 2 points

### User Story

As an authenticated employee composing a kudos, I want to attach images so that my kudos includes visual context.

### Acceptance Criteria

- [ ] Clicking the image add button opens a native file picker (accepts image files, multiple selection).
- [ ] Each selected file is immediately previewed as a thumbnail with an uploading spinner.
- [ ] File is uploaded to `POST /kudos/images`; on success the S3 key is stored for form submission.
- [ ] Up to 5 images can be attached; the add button is hidden once 5 are attached.
- [ ] If upload fails, the thumbnail shows a red error indicator.
- [ ] Image is optional — the form can be submitted without images.

### Technical Notes

- **Endpoint**: POST /kudos/images (multipart/form-data; returns `{ key, url }`)
- **Data Required**: Image file(s); `auth_token` for Authorization header
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM004_S3ImageKeyOwnership

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Single Upload | Modal open | Selects 1 image file | Thumbnail shown with spinner; key stored on success |
| Max Limit | 5 images already attached | Add button | Add button hidden/disabled; no further selection |
| Upload Error | Backend returns error | File selected | Thumbnail shows red error indicator |

---

## US025_RemoveImageFromModal: Remove Uploaded Image from Modal

**Type**: ui
**Interaction**: destructive-action
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee composing a kudos, I want to remove an attached image so that I can correct my selection before submitting.

### Acceptance Criteria

- [ ] Each image thumbnail in the modal shows a small ✕ remove button.
- [ ] Clicking ✕ removes the image from the preview list and frees the S3 key slot.
- [ ] After removal, a new image can be added up to the 5-image maximum.

### Technical Notes

- **Endpoint**: N/A (client-side only; key is simply removed from form state — no DELETE to S3)
- **Data Required**: Image index in local state
- **Dependencies**: None

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | 2 images attached | Clicks ✕ on first image | First image removed; 1 image remains; add button reappears |

---

## US026_ToggleAnonymousInModal: Toggle Anonymous Mode in Write Kudos Modal

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee composing a kudos, I want to mark my kudos as anonymous so that the recipient cannot see my identity.

### Acceptance Criteria

- [ ] An anonymous checkbox is shown in the form below the image section.
- [ ] Checking it reveals an optional alias input field.
- [ ] When submitted anonymously, the backend masks sender fields per PERM005 (`name` → alias or "Ẩn danh", `email` → "", `picture` → "").
- [ ] Unchecking the box hides the alias input.

### Technical Notes

- **Endpoint**: POST /kudos (field: `isAnonymous: true`, `senderAlias?: string`)
- **Data Required**: `isAnonymous` boolean, optional `senderAlias` string
- **Dependencies**: PERM005_AnonymousSenderMasking

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Enable Anonymous | Modal open | Checks anonymous toggle | Alias input appears |
| With Alias | Anonymous checked | Enters alias "Night Owl", submits | Kudos created with `senderAlias="Night Owl"`; shown as "Night Owl" on cards |
| No Alias | Anonymous checked, alias blank | Submits | Kudos created with `senderAlias` omitted; shown as "Ẩn danh" |

---

## US027_SubmitKudos: Submit Kudos

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 3 points

### User Story

As an authenticated employee, I want to submit a completed kudos form so that my colleague receives the recognition.

### Acceptance Criteria

- [ ] Send button is disabled until recipient, title, message, and at least one hashtag are filled.
- [ ] Clicking Send validates the form; if invalid, inline error messages appear per field.
- [ ] On valid form, calls `POST /kudos` with recipient email, title, HTML message, hashtags, optional image keys, isAnonymous flag.
- [ ] On success: toast confirms submission; modal closes; kudos feed and highlight section refresh.
- [ ] On API error: error toast shown; modal remains open for correction.
- [ ] A loading spinner is shown on the Send button while the request is in flight.
- [ ] Image keys attached must belong to the current user (PERM004); violation returns 400 error.

### Technical Notes

- **Endpoint**: POST /kudos
- **Data Required**: `CreateKudosDto` — `receiverEmail`, `title`, `message` (HTML), `hashtags[]`, `imageKeys[]?`, `isAnonymous`, `senderAlias?`
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM004_S3ImageKeyOwnership

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | All required fields filled | Clicks Send | POST /kudos called; success toast; modal closes; feed refreshes |
| Validation Error | Recipient missing | Clicks Send | Error shown on recipient field; no API call |
| API Error | Server returns 500 | Clicks Send | Error toast; modal stays open |
| Image Ownership Violation | imageKey from another user attached | Clicks Send | API returns 400; error toast shown |

---

## US028_LoadMoreKudosFeed: Load More Kudos in All Kudos Feed

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to load more kudos in the all-kudos feed so that I can read older kudos beyond the initial page.

### Acceptance Criteria

- [ ] "Load More" button appears when `kudos.length < total`.
- [ ] Clicking it fetches `GET /kudos?page=N&limit=3` and appends new cards to the bottom.
- [ ] Duplicate cards (same id) are deduplicated.
- [ ] Button shows a loading indicator while fetching.
- [ ] Button is hidden once all kudos are loaded.

### Technical Notes

- **Endpoint**: GET /kudos?page=N&limit=3 (with optional hashtag/department filters)
- **Data Required**: Current page number, total count
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| More Available | 3 kudos shown, 10 total | Clicks "Load More" | Next 3 kudos appended; page increments |
| All Loaded | All kudos shown | — | "Load More" button not visible |

---

## US029_LikeKudosFromFeed: Toggle Like on a Kudos from All Kudos Feed

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 2 points

### User Story

As an authenticated employee, I want to like or unlike a kudos in the all-kudos feed so that I can express appreciation for a recognized colleague.

### Acceptance Criteria

- [ ] Each card in the all-kudos feed shows a like count and heart icon.
- [ ] Like/unlike behavior is identical to US017 (optimistic toggle, rollback on error).
- [ ] Like state is synced across all surfaces via `kudos:liked` window event (highlight carousel, detail modal also update).

### Technical Notes

- **Endpoint**: POST /kudos/:id/like or DELETE /kudos/:id/like
- **Data Required**: `kudos.id`, `kudos.likedByMe`, `kudos.likeCount`, current user email
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM006_LikeUniquenessConstraint

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Like | `likedByMe=false` | Clicks heart | Count +1; heart filled; POST called |
| Unlike | `likedByMe=true` | Clicks heart | Count -1; heart unfilled; DELETE called |
| Cross-surface Sync | Like made in feed | Highlight carousel has same kudos | Highlight card's like count updates via `kudos:liked` event |

---

## US030_CopyKudosLinkFromFeed: Copy Kudos Link from Feed Card

**Type**: ui
**Interaction**: secondary-action
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to copy a direct link to a kudos from the feed card so that I can share it with others.

### Acceptance Criteria

- [ ] "Copy Link" button is visible on each kudos card in the all-kudos feed.
- [ ] Clicking it copies `<origin>/kudos/<id>` to the clipboard.
- [ ] A toast confirmation message is shown after copying.

### Technical Notes

- **Endpoint**: N/A (client-side `navigator.clipboard.writeText`)
- **Data Required**: `kudos.id`, `window.location.origin`
- **Dependencies**: None

### Screens

- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | User on kudos feed | Clicks "Copy Link" on a card | URL `origin/kudos/<id>` copied to clipboard; toast shown |

---

## US031_UnlockSecretBox: Unlock Secret Box

**Type**: ui
**Interaction**: primary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee who has received at least 5 kudos, I want to unlock the secret box so that I can claim my reward.

### Acceptance Criteria

- [ ] "Open Secret Box" button is shown in the Kudos Sidebar.
- [ ] Button is disabled (with a hover tooltip explaining the condition) when `kudosReceived < 5`.
- [ ] Button is enabled when `kudosReceived >= 5`.
- [ ] Clicking the enabled button shows a "coming soon" toast (feature not yet live).
- [ ] `kudosReceived` count is loaded from `GET /kudos/stats`.

### Technical Notes

- **Endpoint**: GET /kudos/stats (to read `kudosReceived`); no separate unlock endpoint yet
- **Data Required**: `KudosStats.kudosReceived`
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG004_KudosSidebar: Kudos Sidebar (Stats + Recipients)

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Locked | `kudosReceived = 2` | Hover over button | Tooltip explains requirement; button disabled |
| Unlocked | `kudosReceived = 5` | Clicks button | "Coming soon" toast shown |

---

## US032_NavigateToRecipientProfileFromSidebar: Navigate to Recipient Profile from Sidebar

**Type**: ui
**Interaction**: navigation
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee, I want to click a recent recipient's name in the sidebar so that I can view their profile page.

### Acceptance Criteria

- [ ] Recent recipients list in the sidebar shows up to 10 unique recent kudos recipients.
- [ ] Clicking a recipient's avatar or name navigates to `/profile/<email>`.
- [ ] Recipients data is loaded from `GET /kudos?limit=10`.

### Technical Notes

- **Endpoint**: GET /kudos?limit=10 (sidebar derives unique receivers from response)
- **Data Required**: `receiver.name`, `receiver.email`, `receiver.picture`
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR007_KudosPage/REG004_KudosSidebar: Kudos Sidebar (Stats + Recipients)

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Recipients list loaded | Clicks a recipient | Navigates to `/profile/<email>` |

---

## US033_LikeKudosFromDetailModal: Toggle Like on a Kudos from Detail Modal

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 2 points

### User Story

As an authenticated employee viewing a kudos detail, I want to like or unlike the kudos so that I can express appreciation from the detail view.

### Acceptance Criteria

- [ ] Like count and heart icon are displayed in the action row of the detail modal.
- [ ] Like/unlike toggle behavior is identical to US017 (optimistic update, rollback on error).
- [ ] Like state change dispatches `kudos:liked` window event so feed cards and highlight carousel also update.
- [ ] If user is unauthenticated (direct URL access), a "Login required" toast is shown instead.

### Technical Notes

- **Endpoint**: POST /kudos/:id/like or DELETE /kudos/:id/like
- **Data Required**: `kudos.id`, `kudos.likedByMe`, `kudos.likeCount`, current user email
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM006_LikeUniquenessConstraint

### Screens

- SCR008_KudosDetailModal: Kudos Detail Modal

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Like | Detail modal open; `likedByMe=false` | Clicks heart | Count +1; heart filled; POST called |
| Unlike | Detail modal open; `likedByMe=true` | Clicks heart | Count -1; heart unfilled; DELETE called |

---

## US034_CopyKudosLinkFromDetailModal: Copy Kudos Link from Detail Modal

**Type**: ui
**Interaction**: secondary-action
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee viewing a kudos detail modal, I want to copy the direct link so that I can share the specific kudos with others.

### Acceptance Criteria

- [ ] "Copy Link" button is visible in the action row of the detail modal.
- [ ] Clicking it copies `<origin>/kudos/<id>` to clipboard.
- [ ] A toast confirmation is shown.

### Technical Notes

- **Endpoint**: N/A (client-side clipboard write)
- **Data Required**: `kudos.id`, `window.location.origin`
- **Dependencies**: None

### Screens

- SCR008_KudosDetailModal: Kudos Detail Modal

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Detail modal open | Clicks "Copy Link" | URL copied; confirmation toast shown |

---

## US035_CloseKudosDetailModal: Close Kudos Detail Modal

**Type**: ui
**Interaction**: navigation
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee viewing a kudos detail modal, I want to close it so that I can return to the kudos feed.

### Acceptance Criteria

- [ ] Clicking the ✕ button closes the modal and navigates back (or to `/kudos` if no history).
- [ ] Pressing Escape closes the modal.
- [ ] Clicking the backdrop (outside modal card) closes the modal.
- [ ] After closing, the kudos feed is still visible and in its prior state.

### Technical Notes

- **Endpoint**: N/A (client-side `router.back()` or `router.push('/kudos')`)
- **Data Required**: `window.history.length` to determine back vs push
- **Dependencies**: None

### Screens

- SCR008_KudosDetailModal: Kudos Detail Modal

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Close via Button | Modal open | Clicks ✕ | Modal closes; returns to feed |
| Close via ESC | Modal open | Presses Escape | Modal closes |
| Close via Backdrop | Modal open | Clicks outside card | Modal closes |

---

## US036_FilterProfileKudosBySentReceived: Filter Profile Kudos by Sent or Received

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 2 points

### User Story

As an authenticated employee viewing a profile page, I want to switch between sent and received kudos so that I can review different aspects of a person's recognition history.

### Acceptance Criteria

- [ ] A "Sent / Received" filter dropdown is present in the ProfileKudosSection header.
- [ ] Selecting "Sent" fetches `GET /kudos?sender=<email>&page=1&limit=3`.
- [ ] Selecting "Received" fetches `GET /kudos?receiver=<email>&page=1&limit=3`.
- [ ] Switching filter resets pagination to page 1 and clears prior results.
- [ ] Total count for the active filter is shown in the dropdown label.

### Technical Notes

- **Endpoint**: GET /kudos?sender=<email> or GET /kudos?receiver=<email>
- **Data Required**: Profile email from URL param; filter mode (sent/received)
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Switch to Received | Filter is "Sent" | Selects "Received" | Fetches received kudos; list resets to page 1 |
| Switch to Sent | Filter is "Received" | Selects "Sent" | Fetches sent kudos; list resets to page 1 |

---

## US037_LoadMoreProfileKudos: Load More Kudos on Profile Page

**Type**: ui
**Interaction**: secondary-action
**Priority**: medium
**Estimate**: 1 point

### User Story

As an authenticated employee viewing a profile page, I want to load more kudos in the profile kudos list so that I can see the full history.

### Acceptance Criteria

- [ ] "Load More" button appears when `kudos.length < total` in the profile kudos list.
- [ ] Clicking appends next page results; deduplication applied.
- [ ] Button shows loading state during fetch.
- [ ] Button hidden once all kudos loaded.

### Technical Notes

- **Endpoint**: GET /kudos?sender=<email>&page=N or GET /kudos?receiver=<email>&page=N
- **Data Required**: Current page, total count, active filter mode
- **Dependencies**: PERM001_BackendJwtRouteGuard

### Screens

- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| More Available | 3 kudos shown, 9 total | Clicks "Load More" | Next 3 appended; button still visible |
| All Loaded | All kudos shown | — | "Load More" button hidden |

---

## US038_LikeKudosFromProfileFeed: Toggle Like on a Kudos from Profile Feed

**Type**: ui
**Interaction**: primary-action
**Priority**: high
**Estimate**: 2 points

### User Story

As an authenticated employee viewing a profile page, I want to like or unlike a kudos in the profile's kudos list so that I can express appreciation from the profile context.

### Acceptance Criteria

- [ ] Each card in the profile kudos list shows a like count and heart icon.
- [ ] Like/unlike toggle behavior identical to US017, US029 (optimistic update, rollback on error, `kudos:liked` event dispatched).

### Technical Notes

- **Endpoint**: POST /kudos/:id/like or DELETE /kudos/:id/like
- **Data Required**: `kudos.id`, `kudos.likedByMe`, `kudos.likeCount`, current user email
- **Dependencies**: PERM001_BackendJwtRouteGuard, PERM006_LikeUniquenessConstraint

### Screens

- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Like | `likedByMe=false` on profile kudos card | Clicks heart | Count +1; heart filled; POST called |
| Unlike | `likedByMe=true` on profile kudos card | Clicks heart | Count -1; heart unfilled; DELETE called |

---

## US039_CopyKudosLinkFromProfileFeed: Copy Kudos Link from Profile Feed Card

**Type**: ui
**Interaction**: secondary-action
**Priority**: low
**Estimate**: 1 point

### User Story

As an authenticated employee viewing a profile page, I want to copy a direct link to a kudos card so that I can share it externally.

### Acceptance Criteria

- [ ] "Copy Link" button visible on each kudos card in the profile kudos list.
- [ ] Clicking copies `<origin>/kudos/<id>` to clipboard.
- [ ] Toast confirmation shown.

### Technical Notes

- **Endpoint**: N/A (client-side clipboard)
- **Data Required**: `kudos.id`, `window.location.origin`
- **Dependencies**: None

### Screens

- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

### Background Logic

_(none)_

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Profile page open | Clicks "Copy Link" on a card | URL copied; toast shown |

---

## Screen → US Map

| Screen | US Codes |
|--------|---------|
| SCR001_HomePage | US003, US004, US005, US006, US007, US008, US009, US010 |
| SCR001_HomePage/REG001_HeroBand | US003, US004 |
| SCR002_LoginPage | US001, US009 |
| SCR003_AuthCallback | US002 |
| SCR004_CountdownPage | US011 |
| SCR005_AwardsPage | US007, US008, US009, US010, US013 |
| SCR005_AwardsPage/REG001_AwardDetailSection | US012 |
| SCR005_AwardsPage/REG002_KudosCTA | US013 |
| SCR006_CommunityStandardsPage | US007, US008, US009, US014 |
| SCR007_KudosPage | US007, US008, US009, US010 |
| SCR007_KudosPage/REG001_HighlightSection | US015, US016, US017 |
| SCR007_KudosPage/REG002_SpotlightSection | US018, US019, US020 |
| SCR007_KudosPage/REG003_AllKudosFeed | US021, US022, US023, US024, US025, US026, US027, US028, US029, US030 |
| SCR007_KudosPage/REG004_KudosSidebar | US031, US032 |
| SCR008_KudosDetailModal | US033, US034, US035 |
| SCR009_ProfilePage | US007, US008, US009, US010 |
| SCR009_ProfilePage/REG003_ProfileKudosList | US036, US037, US038, US039 |

> SCR004_CountdownPage, SCR006_CommunityStandardsPage — purely static/read-only pages; minimum 1 US each (view US) satisfies the ≥N threshold (N=0 interactions beyond navigation).

---

## Cross-Reference Validation

- [x] All US### codes are unique (US001–US039, no gaps or duplicates)
- [x] All acceptance criteria are testable (observable UI/API/state change per criterion)
- [x] All technical notes reference valid endpoints from route-list.md
- [x] All `ui` US### mapped to SCR### or SCR###/REG### existing in screen-list.md
- [x] No `system` US — confirmed by background-logic.md (0 BL items); all 39 US are type `ui`
- [x] Anti-CRUD naming: each US title contains exactly one action verb
- [x] Merge exceptions documented in Interaction Inventory (like toggle, language selector)
- [x] IPE zero check: SCR004 [IPE_ZERO on interactive elements — single view US emitted]; SCR006 [IPE_ZERO on interactive elements — single view US emitted]
- [ ] All US### codes referenced in FeatureList.md (pending Wave 5)
