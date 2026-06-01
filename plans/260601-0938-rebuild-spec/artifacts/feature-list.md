# Feature List

**Project**: Sun* Kudos
**Generated**: 2026-06-01
**Analysis Scope**: 9 screens (SCR001–SCR009), 13 regions, 17 backend routes, 0 background logic items, 7 permissions, 5 data models, 39 user stories

**Code Format**: All codes MUST follow `F###_NameSlug` format (e.g., F001_Auth, F002_UserProfile)
**Screen Code Format**: All screen codes MUST follow `SCR###_NameSlug` format (e.g., SCR001_LoginForm)
**User Story Code Format**: All US codes MUST follow `US###_NameSlug` format (e.g., US001_Login)
**Background Logic Code Format**: All BL codes MUST follow `BL###_NameSlug` format (e.g., BL001_ScheduledReport)
**Permission Code Format**: All PERM codes MUST follow `PERM###_NameSlug` format (e.g., PERM001_ViewReports)

**Feature Types**:
- `ui` - Feature has UI screens (SCR###)
- `background` - Feature only has background logic (BL###, no SCR###)
- `mixed` - Feature has both UI screens and background logic

**Related Screens column format**: Accepts `SCR###`, `SCR###/REG###`, or mixed comma-separated (e.g., `SCR001, SCR002/REG003`). Tokenizer splits on `,` then on `/`. No intra-screen shorthand (`SCR###/REG001+REG002` invalid) — enumerate each ref explicitly.

**Partial-screen ownership note**: A feature with only a `SCR###/REG###` ref owns the region, NOT the parent SCR. The screen shell (`SCR###`) must be owned by a separate F### with a bare `SCR###` ref (typically a layout/dashboard feature).

**Cross-reference**: See ScreenList Regions subsection for region definitions and the `REG###_NameSlug` registry.

---

## Feature Hierarchy

**Note**: Features are sorted by priority from highest to lowest (P0 → P1 → P2 → P3). Priority levels:
- **P0**: Core functionality, blocking issues, or essential features
- **P1**: High priority, significant features
- **P2**: Medium priority, standard features
- **P3**: Low priority, nice-to-have features

| Code | Name | Type | Language | Workspace | Priority |
|------|------|------|----------|-----------|----------|
| F001_GoogleAuth | Google OAuth Sign-In | ui | TypeScript | backend + frontend | P0 |
| F002_AuthCallback | OAuth Callback Token Storage | ui | TypeScript | frontend | P0 |
| F003_FrontendAuthGuard | Frontend Route Guard | ui | TypeScript | frontend | P0 |
| F004_Logout | Logout | ui | TypeScript | frontend | P0 |
| F005_SubmitKudos | Submit Kudos | ui | TypeScript | backend + frontend | P0 |
| F006_LikeUnlike | Like / Unlike a Kudos | ui | TypeScript | backend + frontend | P0 |
| F007_KudosFeed | All Kudos Feed (Paginated) | ui | TypeScript | backend + frontend | P0 |
| F008_KudosHighlight | Highlight Kudos Carousel | ui | TypeScript | backend + frontend | P1 |
| F009_KudosSpotlight | Spotlight Word Cloud | ui | TypeScript | backend + frontend | P1 |
| F010_WriteKudosModal | Write Kudos Modal (Compose) | ui | TypeScript | frontend | P1 |
| F011_KudosImageUpload | Kudos Image Upload | ui | TypeScript | backend + frontend | P1 |
| F012_KudosAnonymous | Anonymous Kudos Toggle | ui | TypeScript | backend + frontend | P1 |
| F013_KudosDetailModal | Kudos Detail Modal | ui | TypeScript | backend + frontend | P1 |
| F014_UserProfilePage | User Profile Page | ui | TypeScript | backend + frontend | P1 |
| F015_ProfileKudosList | Profile Kudos List (Paginated) | ui | TypeScript | backend + frontend | P1 |
| F016_KudosSidebar | Kudos Sidebar (Stats + Recipients) | ui | TypeScript | backend + frontend | P2 |
| F017_SecretBoxUnlock | Secret Box Unlock Gate | ui | TypeScript | backend + frontend | P2 |
| F018_RecipientSearchTrigger | Recipient Search in Kudos Bar | ui | TypeScript | backend + frontend | P2 |
| F019_SpotlightHoverCard | Spotlight Recipient Hover Card | ui | TypeScript | backend + frontend | P2 |
| F020_GlobalHeader | Global Site Header Shell | ui | TypeScript | frontend | P2 |
| F021_NavigateToProfile | Navigate to Profile from Header | ui | TypeScript | frontend | P2 |
| F022_LanguageToggle | UI Language Toggle | ui | TypeScript | frontend | P2 |
| F023_NotificationPanel | Notification Panel (Empty State) | ui | TypeScript | frontend | P2 |
| F024_HomePage | Home Page Shell | ui | TypeScript | frontend | P2 |
| F025_HomeHeroCTA | Home Hero CTA Navigation | ui | TypeScript | frontend | P2 |
| F026_HomeWidgetButton | Home Widget FAB | ui | TypeScript | frontend | P2 |
| F027_AwardsPage | Awards Info Page Shell | ui | TypeScript | frontend | P2 |
| F028_AwardDetailNav | Award Detail Section Navigation | ui | TypeScript | frontend | P2 |
| F029_AwardsCTA | Awards Page Kudos CTA | ui | TypeScript | frontend | P2 |
| F030_CommunityStandardsPage | Community Standards Page | ui | TypeScript | frontend | P3 |
| F031_RuleModal | Community Rules Modal | ui | TypeScript | frontend | P3 |
| F032_CountdownPage | Pre-launch Countdown Page | ui | TypeScript | frontend | P3 |
| F033_CopyKudosLink | Copy Kudos Permalink | ui | TypeScript | frontend | P3 |
| F034_KudosPageShell | Kudos Page Shell | ui | TypeScript | frontend | P2 |
| F035_RecipientSearchModal | Recipient Search in Write Kudos Modal | ui | TypeScript | backend + frontend | P1 |
| F036_HashtagFilter | Highlight Feed Hashtag Filter | ui | TypeScript | backend + frontend | P2 |
| F037_DepartmentFilter | Highlight Feed Department Filter | ui | TypeScript | backend + frontend | P2 |
| F038_SpotlightNameSearch | Spotlight Name Search (Client Filter) | ui | TypeScript | frontend | P2 |
| F039_SendKudosFromSpotlight | Send Kudos Prefilled from Spotlight | ui | TypeScript | frontend | P2 |

---

## Feature Details

### F001_GoogleAuth: Google OAuth Sign-In

**Type**: ui
**Description**: User initiates Google OAuth login on the login page; browser navigates to backend `/auth/google` which redirects to Google consent screen. Backend completes the OAuth handshake, issues a JWT, and redirects browser to `/auth/callback?token=<jwt>`.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 3

**Related Screens**:
- SCR002_LoginPage: Login Page

**Related User Stories**:
- US001_SignInWithGoogle: Sign In with Google

**Related APIs/Routes**:
- (GET) /auth/google
- (GET) /auth/google/callback

**Related Data Models**:
- MODEL001 — User

**Related Background Logic**:
- _(none — 0 BL items)_

**Related Permissions**:
- PERM002_BackendGoogleOAuthGuard: Backend Google OAuth Guard

---

### F002_AuthCallback: OAuth Callback Token Storage

**Type**: ui
**Description**: Page at `/auth/callback` reads the `?token=` query param, persists it to `localStorage` under key `auth_token`, shows a spinner during processing, then redirects the user to `/`.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR003_AuthCallback: Auth Callback

**Related User Stories**:
- US002_CompleteOAuthCallback: Complete OAuth Callback

**Related APIs/Routes**:
- _(none — client-only token extraction)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F003_FrontendAuthGuard: Frontend Route Guard

**Type**: ui
**Description**: `AuthGuard` component mounted in `app/layout.tsx`. On every client navigation checks `auth_token` in localStorage; redirects unauthenticated users to `/login` for all non-public paths (`/login`, `/countdown`, `/auth/callback` are exempt). Renders `null` until check completes to prevent flash.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR008_KudosDetailModal: Kudos Detail Modal
- SCR009_ProfilePage: User Profile Page

**Related User Stories**:
- US008_LogOut: Log Out

**Related APIs/Routes**:
- _(none — client-side guard, no API call)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F004_Logout: Logout

**Type**: ui
**Description**: User clicks "Logout" in the header dropdown. `auth_token` is removed from `localStorage` and the user is immediately redirected to `/login`. No API call. Any subsequent navigation to a protected route is blocked by PERM003.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

**Related User Stories**:
- US008_LogOut: Log Out

**Related APIs/Routes**:
- _(none — client-side only)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F005_SubmitKudos: Submit Kudos

**Type**: ui
**Description**: User fills required fields (recipient, title, message, ≥1 hashtag) in WriteKudosModal and clicks Send. Frontend validates, then POSTs to `/kudos`. On success: success toast, modal closes, kudos feed refreshes. On error: error toast, modal stays open. Send button disabled until form is valid; loading spinner shown during flight.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 5

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US027_SubmitKudos: Submit Kudos

**Related APIs/Routes**:
- (POST) /kudos

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos
- MODEL004 — Hashtag
- MODEL005 — KudosHashtag

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM004_S3ImageKeyOwnership: S3 Image Key Ownership
- PERM005_AnonymousSenderMasking: Anonymous Sender Data Masking

---

### F006_LikeUnlike: Like / Unlike a Kudos

**Type**: ui
**Description**: Authenticated user toggles the like/heart on any kudos card (highlight carousel, all-kudos feed, detail modal, profile feed). Optimistic UI update: count increments/decrements immediately; rolled back on API error. A `kudos:liked` window event syncs state across all surfaces. Backend enforces uniqueness constraint; 409 handled gracefully.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed
- SCR008_KudosDetailModal: Kudos Detail Modal
- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

**Related User Stories**:
- US017_LikeKudosFromHighlight: Like or Unlike a Kudos from Highlight
- US029_LikeKudosFromFeed: Like or Unlike a Kudos from All Kudos Feed
- US033_LikeKudosFromDetailModal: Like or Unlike a Kudos from Detail Modal
- US038_LikeKudosFromProfileFeed: Like or Unlike a Kudos from Profile Feed

**Related APIs/Routes**:
- (POST) /kudos/:id/like
- (DELETE) /kudos/:id/like

**Related Data Models**:
- MODEL002 — Kudos
- MODEL003 — Like

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM006_LikeUniquenessConstraint: Like Uniqueness Per User

---

### F007_KudosFeed: All Kudos Feed (Paginated)

**Type**: ui
**Description**: Displays the paginated all-kudos list in REG003_AllKudosFeed. Initial load fetches `GET /kudos?page=1&limit=3`. "Load More" button appends subsequent pages. Cards show sender (masked if anonymous), receiver, message, hashtags, images, like count. Each card is clickable to open SCR008_KudosDetailModal.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 4

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US028_LoadMoreKudosFeed: Load More Kudos in All Kudos Feed

**Related APIs/Routes**:
- (GET) /kudos

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos
- MODEL003 — Like
- MODEL004 — Hashtag

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM005_AnonymousSenderMasking: Anonymous Sender Data Masking

---

### F008_KudosHighlight: Highlight Kudos Carousel

**Type**: ui
**Description**: Carousel of top-liked/highlighted kudos in REG001_HighlightSection. Fetched from `GET /kudos/highlight` (supports `?hashtag=` and `?department=` query params). Independent loading state. Data loaded on page mount; carousel navigable with prev/next controls.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 3

**Related Screens**:
- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel

**Related User Stories**:
- US015_FilterHighlightByHashtag: Filter Highlight Feed by Hashtag
- US016_FilterHighlightByDepartment: Filter Highlight Feed by Department
- US017_LikeKudosFromHighlight: Like or Unlike a Kudos from Highlight

**Related APIs/Routes**:
- (GET) /kudos/highlight
- (GET) /hashtags
- (GET) /departments

**Related Data Models**:
- MODEL002 — Kudos
- MODEL004 — Hashtag

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM005_AnonymousSenderMasking: Anonymous Sender Data Masking
- PERM006_LikeUniquenessConstraint: Like Uniqueness Per User

---

### F009_KudosSpotlight: Spotlight Word Cloud

**Type**: ui
**Description**: d3-cloud word cloud in REG002_SpotlightSection powered by `GET /kudos/spotlight` and recent recipients from `GET /kudos/spotlight/recent`. Public endpoints (no JWT). Independent loading state. Renders recipient names sized by kudos count.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

**Related User Stories**:
- US018_SearchRecipientInSpotlight: Search Recipient in Spotlight Word Cloud
- US019_ViewRecipientHoverCard: View Recipient Hover Card in Spotlight
- US020_SendKudosFromSpotlightHoverCard: Send Kudos from Spotlight Hover Card

**Related APIs/Routes**:
- (GET) /kudos/spotlight
- (GET) /kudos/spotlight/recent
- (GET) /kudos/recipient/:email/profile

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM007_PublicSpotlightAccess: Public Spotlight Data Access

---

### F010_WriteKudosModal: Write Kudos Modal (Compose)

**Type**: ui
**Description**: Modal dialog for composing kudos. Opens blank (no pre-filled recipient) when the left half of `KudosInputTrigger` is clicked. Supports close via Cancel button, Escape key, or backdrop click. Houses the compose form (recipient, title, Tiptap editor, image picker, hashtag selector, anonymous toggle).

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 3

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US021_OpenWriteKudosModal: Open Write Kudos Modal

**Related APIs/Routes**:
- _(none — modal open trigger only; submit handled by F005)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F011_KudosImageUpload: Kudos Image Upload

**Type**: ui
**Description**: Image attachment in WriteKudosModal. Clicking the add button opens a native file picker; each file is immediately previewed as a thumbnail with an upload spinner. Files are POSTed to `/kudos/images`; returned S3 key stored in form state. Max 5 images. Add button hidden at max. Failed upload shows red indicator on thumbnail. Removing an image (✕) removes it from form state (no S3 DELETE call).

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US024_UploadImageInModal: Upload Image in Write Kudos Modal
- US025_RemoveImageFromModal: Remove Uploaded Image from Modal

**Related APIs/Routes**:
- (POST) /kudos/images

**Related Data Models**:
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM004_S3ImageKeyOwnership: S3 Image Key Ownership

---

### F012_KudosAnonymous: Anonymous Kudos Toggle

**Type**: ui
**Description**: Anonymous checkbox in WriteKudosModal. Checking it reveals an alias input field. When form is submitted with `isAnonymous=true`, backend masks sender name/email/picture fields in all read responses (`KudosService.toCard()`). Unchecking hides the alias input.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US026_ToggleAnonymousInModal: Toggle Anonymous Mode in Write Kudos Modal

**Related APIs/Routes**:
- (POST) /kudos

**Related Data Models**:
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM005_AnonymousSenderMasking: Anonymous Sender Data Masking

---

### F013_KudosDetailModal: Kudos Detail Modal

**Type**: ui
**Description**: Full-detail view for a single kudos, rendered as a modal overlay (Next.js parallel route intercept `/kudos/:id`) or a direct-URL fallback page. Fetches `GET /kudos/:id`. Shows sender, receiver, message (sanitized HTML), images, hashtags, like count. Supports close via ✕, Escape, or backdrop. Like/unlike and copy-link actions available inline.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR008_KudosDetailModal: Kudos Detail Modal

**Related User Stories**:
- US033_LikeKudosFromDetailModal: Like or Unlike a Kudos from Detail Modal
- US034_CopyKudosLinkFromDetailModal: Copy Kudos Link from Detail Modal
- US035_CloseKudosDetailModal: Close Kudos Detail Modal

**Related APIs/Routes**:
- (GET) /kudos/:id

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos
- MODEL003 — Like
- MODEL004 — Hashtag

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM005_AnonymousSenderMasking: Anonymous Sender Data Masking
- PERM006_LikeUniquenessConstraint: Like Uniqueness Per User

---

### F014_UserProfilePage: User Profile Page

**Type**: ui
**Description**: Profile page at `/profile/:email`. Fetches `GET /kudos/profile/:email` for user data and aggregate stats (kudosReceived, kudosSent, heartsReceived). Renders ProfileHero (avatar, name, department, star rank), ProfileIconCollection, ProfileStatsBox. Page-level loading/error state.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 4

**Related Screens**:
- SCR009_ProfilePage: User Profile Page
- SCR009_ProfilePage/REG001_ProfileHero: Profile Hero + Icon Collection
- SCR009_ProfilePage/REG002_ProfileStats: Profile Stats Box

**Related User Stories**:
- US007_NavigateToProfileFromHeader: Navigate to Own Profile from Header

**Related APIs/Routes**:
- (GET) /kudos/profile/:email

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F015_ProfileKudosList: Profile Kudos List (Paginated)

**Type**: ui
**Description**: Paginated kudos list in REG003_ProfileKudosList on the profile page. Supports sent/received filter dropdown (resets to page 1 on switch). "Load More" appends next page. Cards support like/unlike and copy-link. Fetches `GET /kudos?sender=<email>` or `?receiver=<email>`.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 3

**Related Screens**:
- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

**Related User Stories**:
- US036_FilterProfileKudosBySentReceived: Filter Profile Kudos by Sent or Received
- US037_LoadMoreProfileKudos: Load More Kudos on Profile Page
- US038_LikeKudosFromProfileFeed: Like or Unlike a Kudos from Profile Feed
- US039_CopyKudosLinkFromProfileFeed: Copy Kudos Link from Profile Feed Card

**Related APIs/Routes**:
- (GET) /kudos

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos
- MODEL003 — Like

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard
- PERM005_AnonymousSenderMasking: Anonymous Sender Data Masking
- PERM006_LikeUniquenessConstraint: Like Uniqueness Per User

---

### F016_KudosSidebar: Kudos Sidebar (Stats + Recipients)

**Type**: ui
**Description**: Sticky sidebar in REG004_KudosSidebar on the Kudos page. Fetches `GET /kudos/stats` for personal stats (kudosReceived, kudosSent, heartsReceived) and `GET /kudos?limit=10` for recent recipients list. Clicking a recipient navigates to `/profile/:email`.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG004_KudosSidebar: Kudos Sidebar (Stats + Recipients)

**Related User Stories**:
- US031_UnlockSecretBox: Unlock Secret Box
- US032_NavigateToRecipientProfileFromSidebar: Navigate to Recipient Profile from Sidebar

**Related APIs/Routes**:
- (GET) /kudos/stats
- (GET) /kudos

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard

---

### F017_SecretBoxUnlock: Secret Box Unlock Gate

**Type**: ui
**Description**: "Open Secret Box" button in REG004_KudosSidebar. Enabled only when `kudosReceived >= 5` (read from `GET /kudos/stats`). Disabled state shows a hover tooltip explaining the condition. Clicking the enabled button shows a "coming soon" toast; no backend unlock endpoint exists yet.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG004_KudosSidebar: Kudos Sidebar (Stats + Recipients)

**Related User Stories**:
- US031_UnlockSecretBox: Unlock Secret Box

**Related APIs/Routes**:
- (GET) /kudos/stats

**Related Data Models**:
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard

---

### F018_RecipientSearchTrigger: Recipient Search in Kudos Bar

**Type**: ui
**Description**: Right half of `KudosInputTrigger` in REG003_AllKudosFeed. Clicking expands into a live debounced (300ms) search input that queries `GET /users?search=<term>`. Selecting a user opens WriteKudosModal with that user pre-filled as recipient. Escape collapses the search bar.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US022_SearchRecipientInKudosTrigger: Search Recipient via Kudos Bar Search

**Related APIs/Routes**:
- (GET) /users

**Related Data Models**:
- MODEL001 — User

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard

---

### F019_SpotlightHoverCard: Spotlight Recipient Hover Card

**Type**: ui
**Description**: Hovering a name in the spotlight word cloud fetches `GET /kudos/recipient/:email/profile` and renders a floating hover card with avatar, name, department, kudos stats, and a "Gửi KUDO" button. Skeleton loading state shown during fetch. Card disappears when mouse leaves both the name and the card.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

**Related User Stories**:
- US019_ViewRecipientHoverCard: View Recipient Hover Card in Spotlight

**Related APIs/Routes**:
- (GET) /kudos/recipient/:email/profile

**Related Data Models**:
- MODEL001 — User
- MODEL002 — Kudos

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM007_PublicSpotlightAccess: Public Spotlight Data Access

---

### F020_GlobalHeader: Global Site Header Shell

**Type**: ui
**Description**: `SiteHeader` layout component rendered on all auth-required pages. Contains logo (home link), nav links (About SAA / Awards / Kudos), user profile dropdown (avatar, Profile link, Logout), notification bell, and language selector. No API call; reads user info from JWT payload in localStorage.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

**Related User Stories**:
- _(none — US007/US008/US009/US010 are owned by their canonical features: F021, F004, F022, F023 respectively. F020 is a layout shell; it delegates interactions to those sibling features.)_

**Related APIs/Routes**:
- _(none — client-only header)_

**Related Data Models**:
- MODEL001 — User

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F021_NavigateToProfile: Navigate to Profile from Header

**Type**: ui
**Description**: User opens the header dropdown and clicks "Profile"; navigates to `/profile/<currentUserEmail>`. Current user email is derived from the JWT payload in localStorage. Authentication state is preserved on navigation.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

**Related User Stories**:
- US007_NavigateToProfileFromHeader: Navigate to Own Profile from Header

**Related APIs/Routes**:
- _(none — client-side navigation)_

**Related Data Models**:
- MODEL001 — User

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F022_LanguageToggle: UI Language Toggle

**Type**: ui
**Description**: Language selector visible on the login page and in the header on all auth-required pages. Switches UI between Vietnamese (VN) and English (EN) via `lib/i18n.ts`. State persists within the session via context. No API call.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page
- SCR002_LoginPage: Login Page
- SCR005_AwardsPage: Awards Info Page
- SCR006_CommunityStandardsPage: Community Standards
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

**Related User Stories**:
- US009_ToggleLanguage: Toggle UI Language

**Related APIs/Routes**:
- _(none — client-side i18n)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F023_NotificationPanel: Notification Panel (Empty State)

**Type**: ui
**Description**: Bell icon in the site header opens a notification dropdown panel. Currently renders a static empty-state message (no notification API exists). Clicking outside closes the panel.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page
- SCR005_AwardsPage: Awards Info Page
- SCR007_KudosPage: Kudos Feed Page
- SCR009_ProfilePage: User Profile Page

**Related User Stories**:
- US010_ViewNotificationPanel: View Notification Panel

**Related APIs/Routes**:
- _(none — static empty state)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F024_HomePage: Home Page Shell

**Type**: ui
**Description**: Landing page at `/` assembling `SiteHeader`, `HeroSection` (REG001), `AwardsSection` (REG002), `KudosSection` (REG003), `SiteFooter`, and `WidgetButton`. No API call at page level; all data is static/i18n. Composite page shell — owns the bare SCR001 ref.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 6

**Related Screens**:
- SCR001_HomePage: Home Page

**Related User Stories**:
- _(none — US005 is owned by F031_RuleModal; US006 is owned by F026_HomeWidgetButton. F024 is the page shell; it delegates widget interactions to those sibling features.)_

**Related APIs/Routes**:
- _(none — static page)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F025_HomeHeroCTA: Home Hero CTA Navigation

**Type**: ui
**Description**: Hero band on the home page (REG001_HeroBand) contains two CTA links: "About Awards" → `/awards` and "About Kudos" → `/kudos`. Client-side navigation. Authentication state preserved.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage/REG001_HeroBand: Hero + Event Info Band

**Related User Stories**:
- US003_NavigateToAwardsFromHero: Navigate to Awards from Hero
- US004_NavigateToKudosFromHero: Navigate to Kudos from Hero

**Related APIs/Routes**:
- _(none — client-side navigation)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F026_HomeWidgetButton: Home Widget FAB

**Type**: ui
**Description**: Floating action button on the home page. Expands to reveal "Thể lệ" (opens RuleModal) and "Viết KUDOS" (navigates to `/kudos`) options. Widget is part of SCR001_HomePage shell but owns the interaction surface — maps to SCR001 bare ref (already owned by F024) via distinct interaction coverage for US005 and US006.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR001_HomePage: Home Page

**Related User Stories**:
- US006_NavigateToKudosFromWidget: Navigate to Kudos from Widget

**Related APIs/Routes**:
- _(none — modal trigger + client navigation)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F027_AwardsPage: Awards Info Page Shell

**Type**: ui
**Description**: Page at `/awards`. Assembles `SiteHeader`, `AwardInfoHero` (static banner — layout sub-component, not a region), `AwardInfoSection` (REG001_AwardDetailSection), `KudosSection` (REG002_KudosCTA), `SiteFooter`, `WidgetButton`. All content is static i18n — no API calls. Composite page shell — owns the bare SCR005 ref.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 5

**Related Screens**:
- SCR005_AwardsPage: Awards Info Page

**Related User Stories**:
- US012_NavigateAwardDetails: Navigate to Award Detail Section
- US013_NavigateToKudosFromAwardsCTA: Navigate to Kudos from Awards CTA

**Related APIs/Routes**:
- _(none — static page)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F028_AwardDetailNav: Award Detail Section Navigation

**Type**: ui
**Description**: Sticky desktop sidebar nav and mobile horizontal nav inside REG001_AwardDetailSection of the Awards page. Clicking an award name scrolls to that award card. Active item is highlighted. Client-side scroll only; 6 static award items from i18n.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR005_AwardsPage/REG001_AwardDetailSection: Award Detail Cards + Sticky Nav

**Related User Stories**:
- US012_NavigateAwardDetails: Navigate to Award Detail Section

**Related APIs/Routes**:
- _(none — client-side scroll)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F029_AwardsCTA: Awards Page Kudos CTA

**Type**: ui
**Description**: Kudos CTA band at the bottom of the Awards page (REG002_KudosCTA on SCR005). Contains a link to `/kudos`. Same `KudosSection` component reused from homepage. Navigation preserves auth state.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR005_AwardsPage/REG002_KudosCTA: Kudos CTA Band

**Related User Stories**:
- US013_NavigateToKudosFromAwardsCTA: Navigate to Kudos from Awards CTA

**Related APIs/Routes**:
- _(none — client-side navigation)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F030_CommunityStandardsPage: Community Standards Page

**Type**: ui
**Description**: Static page at `/community-standards`. Renders `CommunityStandardsHero` and `CommunityStandardsContent`. No API calls. Auth-required. Owns the bare SCR006 ref.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 3

**Related Screens**:
- SCR006_CommunityStandardsPage: Community Standards

**Related User Stories**:
- US014_ViewCommunityStandards: View Community Standards Page

**Related APIs/Routes**:
- _(none — static content)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F031_RuleModal: Community Rules Modal

**Type**: ui
**Description**: Inline modal dialog opened from the WidgetButton FAB on the home page (clicking "Thể lệ"). Shows the same community standards content as SCR006 without navigating away. Modal is closeable; underlying page state unchanged.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR001_HomePage: Home Page

**Related User Stories**:
- US005_OpenRuleModalFromWidget: Open Community Rules Modal from Widget

**Related APIs/Routes**:
- _(none — static modal content)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F032_CountdownPage: Pre-launch Countdown Page

**Type**: ui
**Description**: Public page at `/countdown`. Renders `PrelaunchPage` with a client-side countdown timer to a hardcoded event date and static event info. No API. No auth required; explicitly listed in `PUBLIC_PATHS`.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR004_CountdownPage: Countdown / Pre-launch

**Related User Stories**:
- US011_ViewCountdownPage: View Pre-launch Countdown

**Related APIs/Routes**:
- _(none — static countdown)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F033_CopyKudosLink: Copy Kudos Permalink

**Type**: ui
**Description**: "Copy Link" button on kudos cards in the all-kudos feed, kudos detail modal, and profile kudos list. Copies `<origin>/kudos/<id>` to clipboard via `navigator.clipboard.writeText`. Shows a toast confirmation. Client-side only, no API call.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed
- SCR008_KudosDetailModal: Kudos Detail Modal
- SCR009_ProfilePage/REG003_ProfileKudosList: Profile Kudos List

**Related User Stories**:
- US030_CopyKudosLinkFromFeed: Copy Kudos Link from Feed Card
- US034_CopyKudosLinkFromDetailModal: Copy Kudos Link from Detail Modal
- US039_CopyKudosLinkFromProfileFeed: Copy Kudos Link from Profile Feed Card

**Related APIs/Routes**:
- _(none — client-side clipboard)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F034_KudosPageShell: Kudos Page Shell

**Type**: ui
**Description**: Composite page shell at `/kudos`. Assembles `SiteHeader`, `KudosHero`, `HighlightSection` (REG001), `SpotlightSection` (REG002), `AllKudosSection` (REG003 + REG004), `SiteFooter`, `WidgetButton`, and the `@modal` parallel route slot. Owns the bare SCR007 ref. Individual regions owned by their respective features (F008, F009, F007, F016).

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 7

**Related Screens**:
- SCR007_KudosPage: Kudos Feed Page

**Related User Stories**:
- _(none — US007/US008/US009/US010 are owned by their canonical features: F021, F004, F022, F023 respectively. F034 is a page shell; it delegates header interactions to those sibling features.)_

**Related APIs/Routes**:
- _(none — page shell; API calls owned by region features)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_FrontendAuthGuard: Frontend Auth Guard

---

### F035_RecipientSearchModal: Recipient Search in Write Kudos Modal

**Type**: ui
**Description**: Recipient search field inside WriteKudosModal. Debounced (300ms) query to `GET /users?search=<term>`. Empty query loads all users. Selecting a user renders a chip (name + avatar). Clicking ✕ on chip clears the field. Validation: red border + error message if form submitted without a recipient.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 2

**Related Screens**:
- SCR007_KudosPage/REG003_AllKudosFeed: All Kudos Feed

**Related User Stories**:
- US023_SelectRecipientInModal: Select Recipient in Write Kudos Modal

**Related APIs/Routes**:
- (GET) /users

**Related Data Models**:
- MODEL001 — User

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard

---

### F036_HashtagFilter: Highlight Feed Hashtag Filter

**Type**: ui
**Description**: Hashtag filter dropdown in the REG001_HighlightSection header row. Options populated from `GET /hashtags`. Selecting a hashtag refetches `GET /kudos/highlight?hashtag=<name>`. Selecting "All" resets to unfiltered. Loading state shown during refetch.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel

**Related User Stories**:
- US015_FilterHighlightByHashtag: Filter Highlight Feed by Hashtag

**Related APIs/Routes**:
- (GET) /kudos/highlight
- (GET) /hashtags

**Related Data Models**:
- MODEL004 — Hashtag

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard

---

### F037_DepartmentFilter: Highlight Feed Department Filter

**Type**: ui
**Description**: Department filter dropdown in the REG001_HighlightSection header row. Options populated from `GET /departments`. Selecting a department refetches `GET /kudos/highlight?department=<name>`. Independent of hashtag filter — both can be active simultaneously.

**Workspace**: backend + frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG001_HighlightSection: Highlight Kudos Carousel

**Related User Stories**:
- US016_FilterHighlightByDepartment: Filter Highlight Feed by Department

**Related APIs/Routes**:
- (GET) /kudos/highlight
- (GET) /departments

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_BackendJwtRouteGuard: Backend JWT Route Guard

---

### F038_SpotlightNameSearch: Spotlight Name Search (Client Filter)

**Type**: ui
**Description**: Search input in REG002_SpotlightSection. Filters the already-loaded word cloud data client-side by matching typed text against recipient names. Clearing restores the full word cloud. No API call — operates on data already in component state.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

**Related User Stories**:
- US018_SearchRecipientInSpotlight: Search Recipient in Spotlight Word Cloud

**Related APIs/Routes**:
- _(none — client-side filter)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F039_SendKudosFromSpotlight: Send Kudos Prefilled from Spotlight

**Type**: ui
**Description**: "Gửi KUDO" button on the spotlight hover card (REG002_SpotlightSection). Clicking opens WriteKudosModal with recipient pre-filled from the hover card profile. Recipient field in the modal cannot be cleared (pre-filled context). Eventual submission is handled by F005.

**Workspace**: frontend
**Languages**: TypeScript
**Components**: 1

**Related Screens**:
- SCR007_KudosPage/REG002_SpotlightSection: Spotlight Word Cloud

**Related User Stories**:
- US020_SendKudosFromSpotlightHoverCard: Send Kudos from Spotlight Hover Card

**Related APIs/Routes**:
- _(none — modal trigger; submit handled by F005_SubmitKudos)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

## Summary

- **Total Features**: 39
- **Total Screens**: 9 (SCR001–SCR009)
- **Total User Stories**: 39 (US001–US039)
- **Total Routes**: 17 backend + 10 frontend = 27
- **Total Data Models**: 5 (MODEL001–MODEL005)
- **Total Background Logic**: 0
- **Total Permissions**: 7 (PERM001–PERM007)
- **Languages Detected**: TypeScript (backend NestJS 11, frontend Next.js 16 App Router + React 19)

---

## US Coverage Confirmation

All 39 user stories mapped to exactly one feature. No orphans.

| US Code | Feature |
|---------|---------|
| US001_SignInWithGoogle | F001_GoogleAuth |
| US002_CompleteOAuthCallback | F002_AuthCallback |
| US003_NavigateToAwardsFromHero | F025_HomeHeroCTA |
| US004_NavigateToKudosFromHero | F025_HomeHeroCTA |
| US005_OpenRuleModalFromWidget | F031_RuleModal |
| US006_NavigateToKudosFromWidget | F026_HomeWidgetButton |
| US007_NavigateToProfileFromHeader | F021_NavigateToProfile |
| US008_LogOut | F004_Logout |
| US009_ToggleLanguage | F022_LanguageToggle |
| US010_ViewNotificationPanel | F023_NotificationPanel |
| US011_ViewCountdownPage | F032_CountdownPage |
| US012_NavigateAwardDetails | F028_AwardDetailNav |
| US013_NavigateToKudosFromAwardsCTA | F029_AwardsCTA |
| US014_ViewCommunityStandards | F030_CommunityStandardsPage |
| US015_FilterHighlightByHashtag | F036_HashtagFilter |
| US016_FilterHighlightByDepartment | F037_DepartmentFilter |
| US017_LikeKudosFromHighlight | F006_LikeUnlike |
| US018_SearchRecipientInSpotlight | F038_SpotlightNameSearch |
| US019_ViewRecipientHoverCard | F019_SpotlightHoverCard |
| US020_SendKudosFromSpotlightHoverCard | F039_SendKudosFromSpotlight |
| US021_OpenWriteKudosModal | F010_WriteKudosModal |
| US022_SearchRecipientInKudosTrigger | F018_RecipientSearchTrigger |
| US023_SelectRecipientInModal | F035_RecipientSearchModal |
| US024_UploadImageInModal | F011_KudosImageUpload |
| US025_RemoveImageFromModal | F011_KudosImageUpload |
| US026_ToggleAnonymousInModal | F012_KudosAnonymous |
| US027_SubmitKudos | F005_SubmitKudos |
| US028_LoadMoreKudosFeed | F007_KudosFeed |
| US029_LikeKudosFromFeed | F006_LikeUnlike |
| US030_CopyKudosLinkFromFeed | F033_CopyKudosLink |
| US031_UnlockSecretBox | F017_SecretBoxUnlock |
| US032_NavigateToRecipientProfileFromSidebar | F016_KudosSidebar |
| US033_LikeKudosFromDetailModal | F006_LikeUnlike |
| US034_CopyKudosLinkFromDetailModal | F033_CopyKudosLink |
| US035_CloseKudosDetailModal | F013_KudosDetailModal |
| US036_FilterProfileKudosBySentReceived | F015_ProfileKudosList |
| US037_LoadMoreProfileKudos | F015_ProfileKudosList |
| US038_LikeKudosFromProfileFeed | F006_LikeUnlike |
| US039_CopyKudosLinkFromProfileFeed | F033_CopyKudosLink |

---

## Cross-Reference Validation

- [x] All F### codes are unique (F001–F039, no gaps or duplicates)
- [x] All F### codes referenced in UserStories.md (39/39 US mapped)
- [x] All screen references are valid (SCR### and SCR###/REG### exist in ScreenList)
- [x] All user story references are valid (US### exist in UserStories)
- [x] All route references are valid (confirmed against RouteList)
- [x] All data model references are valid (MODEL001–MODEL005 confirmed in DataModel)
- [x] All background logic references are valid (0 BL items — none referenced)
- [x] All permission references are valid (PERM001–PERM007 confirmed in Permissions)
- [x] Every US has exactly one parent feature (no orphans, no double-mapped US)
- [x] Every screen has a parent feature (F### owns each SCR###)
- [x] Every user-facing route maps to a feature (16 of 17 backend routes covered; `GET /` is an infrastructure health-check route explicitly excluded from feature mapping — documented in RouteList `## Excluded Routes`)
- [x] Every data model maps to a feature (MODEL001–MODEL005 all referenced)
- [x] Every background logic maps to a feature (0 BL — N/A)
- [x] Every permission maps to a feature (PERM001–PERM007 all referenced)
- [x] Partial-screen ownership rule applied: bare SCR### refs owned by shell features (F024→SCR001, F027→SCR005, F030→SCR006, F034→SCR007, F014→SCR009); region-only features use SCR###/REG### syntax
- [x] No "and/or" broad buckets — each feature has single intent
- [x] US017, US029, US033, US038 all correctly mapped to F006_LikeUnlike (same toggle interaction, multiple surfaces — valid multi-surface single feature)
