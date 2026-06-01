---
failed: 6
warnings: 8
result: FAIL
---
# Review Report — Rebuild-Spec Artifacts

**Reviewer**: Staff Engineer (automated, Wave 7a)
**Date**: 2026-06-01
**Scope**: 9 core artifacts (no feature specs reviewed — Wave 7b)

---

## Summary

| Metric | Value |
|--------|-------|
| Artifacts reviewed | 9 core |
| Critical issues | 6 |
| Warnings | 8 |
| Result | **FAIL** |

---

## Critical Issues

### C1: SystemOverview — Missing `# System Overview` H1 heading — OPEN
- **Severity**: critical
- **Location**: `system-overview.md:1`
- **Description**: The artifact begins with frontmatter metadata (`**Project**`, `**Generated**`, `**Architecture Type**`) and goes directly into `## Executive Summary`. The required `# System Overview` H1 title heading (the root heading per template) is absent. Template section order requires `# System Overview` → `## Executive Summary` → …; the heading hierarchy is broken.
- **Fix**: Insert `# System Overview` as the first line of the document.

---

### C2: RouteList / FeatureList — `GET /` (AppController) has no owning F### — OPEN
- **Severity**: critical
- **Location**: `route-list.md:10`, `feature-list.md` (absent)
- **Description**: `GET /` (AppController@getHello, no middleware) is documented in RouteList but no F### in FeatureList references it. FeatureList cross-reference validation claims "Every route maps to a feature (all 17 backend routes covered)" — this is incorrect; `GET /` is orphaned. Verification-checklist rule: "Route documented but no F### in FeatureList references it → critical."
- **Fix**: Either add a minimal F### (e.g., F040_RootHealthCheck, type `background`) that owns this route, or document the route as intentionally out-of-scope in a `## Excluded Routes` section with justification.

---

### C3: ScreenList — SCR005_AwardsPage/REG001_AwardInfoHero violates Trap 1 (visual-only independence) — OPEN
- **Severity**: critical
- **Location**: `screen-list.md` (SCR005 Regions table, REG001_AwardInfoHero row)
- **Description**: The only independence signals cited for REG001_AwardInfoHero are "Distinct visual zone; independent of award list content." Visual separation alone is explicitly not sufficient per Failure Trap 1: "Visual separation alone is NOT sufficient." No distinct API endpoint, no independent loading state, no independent scroll container, no auth gate, no distinct business workflow, no distinct mutation surface is present for this region. The hero is a static banner with no functional independence from the AwardInfoSection.
- **Fix**: Either (a) remove REG001_AwardInfoHero and fold its description into the SCR005 description (collapsing the hero as a layout sub-component, not a REG), or (b) cite a valid non-visual independence signal (e.g., distinct business workflow that differs from the award list). Option (a) is recommended — static hero banners with no API or state independence are layout components, not regions.

---

### C4: UserStories — Compound "or" action verb in 4 US titles ("Like or Unlike") — OPEN
- **Severity**: critical
- **Location**: `user-stories.md:102` (US017), `:114` (US029), `:119` (US033), `:123` (US038)
- **Description**: US017 "Like or Unlike a Kudos from Highlight", US029 "Like or Unlike a Kudos from All Kudos Feed", US033 "Like or Unlike a Kudos from Detail Modal", US038 "Like or Unlike a Kudos from Profile Feed" — all four titles contain "or" joining two action verbs. Verification-checklist rule: "US combines multiple user actions (compound title with 'and'/'or', multiple verbs …) → critical." The IPE merge exception documented in the Interaction Inventory notes is a researcher justification but does not override the reviewer's required flag.
- **Fix**: Rename each US to a single-verb title. Given the toggle is a single affordance (one button, one interaction), the idiomatic fix is to name them by the dominant action and note the inverse in the description: e.g., "Like Kudos from Highlight" (with unlike documented as the reverse path in acceptance criteria). Alternatively, split into two US (Like + Unlike) per surface if distinct test paths are needed.

---

### C5: FeatureList — US005 and US006 mapped to multiple F### (duplicate ownership) — OPEN
- **Severity**: critical
- **Location**: `feature-list.md:843-845` (F024 lists US005, US006), `feature-list.md:901-904` (F026 lists US005, US006), `feature-list.md:1050-1051` (F031 lists US005)
- **Description**: US005 (Open Community Rules Modal from Widget) appears in the Related User Stories of F024_HomePage, F026_HomeWidgetButton, and F031_RuleModal. US006 (Navigate to Kudos from Widget) appears in F024_HomePage and F026_HomeWidgetButton. The US Coverage Confirmation table (the authoritative mapping) assigns US005→F031 and US006→F026 — but the Feature Details sections above contradict it. Every US must be referenced by exactly one F###; multiple ownership is a critical violation. Checklist rule: "US### not referenced by any F### in FeatureList → critical" covers the orphan case; symmetrically, double-referencing causes ambiguous ownership.
- **Fix**: Remove US005 from F024 and F026 Related User Stories (it belongs solely to F031). Remove US006 from F024 Related User Stories (it belongs solely to F026). The Coverage Confirmation table is already correct — align the Feature Details sections to match it.

---

### C6: FeatureList — US007/US008/US009/US010 each appear in two F### sections (F020 and F034) — OPEN
- **Severity**: critical
- **Location**: `feature-list.md:710-714` (F020_GlobalHeader lists US007, US008, US009, US010), `feature-list.md:1140-1144` (F034_KudosPageShell lists US007, US008, US009, US010)
- **Description**: US007 (Navigate to Profile from Header), US008 (Log Out), US009 (Toggle Language), US010 (View Notification Panel) each appear in the Related User Stories of both F020_GlobalHeader and F034_KudosPageShell. The Coverage Confirmation table correctly assigns them to F021, F004, F022, and F023 respectively — meaning all four of these stories appear in F020 and F034 without being the canonical owner in either case. This is the same duplicate-ownership pattern as C5, compounded across 4 stories.
- **Fix**: Remove US007, US008, US009, US010 from F020_GlobalHeader and F034_KudosPageShell Related User Stories. These stories are already owned by F021, F004, F022, F023. F020 and F034 are shell/layout features; they do not need to claim ownership of interaction stories owned by sibling features.

---

## Warnings

### W1: SystemOverview — Technology Stack version column "No data" for 5 entries — OPEN
- **Severity**: warning
- **Location**: `system-overview.md` Technology Stack table (rows: Tiptap, TypeORM, Passport, Multer, Docker Compose)
- **Description**: Five technology rows show "No data" in the Version column. The checklist requires Layer/Technology/Version columns populated. These versions are discoverable from `backend/package.json` and `frontend/package.json`.
- **Fix**: Populate from package.json (e.g., TypeORM ~0.3.x, Multer ~1.4.x, passport-jwt ~4.x, Tiptap ~2.x). "No data" is a placeholder; replace with actual semver range from package-lock or package.json.

---

### W2: RouteList — Scout Notes count mismatch (11 vs 12 KudosController routes) — OPEN
- **Severity**: warning
- **Location**: `scout-report.md:171` (Notes section); `route-list.md` KudosController table
- **Description**: The scout report Notes section states "KudosController: 11 routes" but the route-list documents 12 KudosController routes (adding `GET /kudos/profile/:email`). This is a scout-side under-count in the Notes text (the File Inventory itself is correct). The route-list is the authoritative source and is consistent with the codebase.
- **Fix**: Update the scout Notes section count to 12 (scout document; no impact on route-list validity).

---

### W3: ScreenList — SCR001_HomePage REG001/REG003 and SCR005_AwardsPage REG003 have weak independence signals — OPEN
- **Severity**: warning
- **Location**: `screen-list.md` SCR001 Regions table (REG001_HeroBand, REG003_KudosCTA); SCR005 Regions table (REG003_KudosCTA)
- **Description**: REG001_HeroBand (SCR001) cites "distinct navigation surface (CTA buttons to /awards, /kudos)" as its non-visual signal. REG003_KudosCTA on both SCR001 and SCR005 cites "distinct navigation surface (link to /kudos); distinct business workflow (platform intro/CTA)." Navigation links are UI affordances, not API/data independence signals. Trap 1 says the independence signals must be drawn from: distinct API endpoint, independent loading state, independent scroll container, independent auth gate, distinct business workflow, or distinct mutation surface. "Navigation surface" is not on this list; "distinct business workflow" is borderline for static CTA bands with no state or API.
- **Fix**: Either (a) consolidate these REGs into the parent screen description since they have no data/state independence, or (b) explicitly cite "distinct business workflow" with a justification sentence explaining how the business concern genuinely differs (e.g., "hero band is event-announcement workflow; kudos CTA is platform-onboarding workflow").

---

### W4: ScreenList — SCR009_ProfilePage REG002_ProfileStats weak independence signal — OPEN
- **Severity**: warning
- **Location**: `screen-list.md` SCR009 Regions table (REG002_ProfileStats)
- **Description**: REG002_ProfileStats signals are "Data from same parent load but distinct business workflow (aggregate stats display); distinct validation path (shows loading/error independently at page level)." Data comes from the same `GET /kudos/profile/:email` as REG001_ProfileHero — no separate API endpoint. "Shows loading/error independently at page level" means both REG001 and REG002 share the same loading state (the page-level fetch). No distinct scroll, mutation surface, or write endpoint. Trap 1 boundary case.
- **Fix**: Consider merging REG001 and REG002 into a single `REG001_ProfileHeaderArea` (same data source, same loading state, no mutation surface difference). REG003_ProfileKudosList remains valid with its own paginated endpoint.

---

### W5: ScreenFlow — SCR009 entry point from SCR008 missing in Screen Access Paths table — OPEN
- **Severity**: warning
- **Location**: `screen-flow.md:204-211` (SCR009 Entry Points description) vs. `screen-flow.md:49-72` (Screen Access Paths table)
- **Description**: The SCR009_ProfilePage entry points description includes "Click sender/receiver block from SCR008_KudosDetailModal (if link is present)" but this transition is not listed in the Screen Access Paths table. The table is incomplete; navigating from the detail modal to a profile page is a user-visible flow that should be documented.
- **Fix**: Add a row to the Screen Access Paths table: `SCR008_KudosDetailModal → SCR009_ProfilePage | Click sender/receiver link | authenticated`.

---

### W6: DataModel — `frontend/lib/types/kudos.ts` (model-type file) has no MODEL### entry — OPEN
- **Severity**: warning
- **Location**: `scout-report.md:145` (File Inventory: `frontend/lib/types/kudos.ts model`); `data-model.md` (absent)
- **Description**: The scout marks `frontend/lib/types/kudos.ts` as type `model`. The DataModel artifact does not document it. The checklist states "Entity in codebase but not documented → critical" for model files. However, this is a frontend TypeScript type definition (not a DB entity), so it may be intentionally out of scope for the data model (which covers database-persisted entities). The scout's `model` classification may be over-broad.
- **Fix**: Add a brief note in `data-model.md` § Summary acknowledging the frontend type (`kudos.ts` — TypeScript interface for API response shape, not a DB entity) as intentionally excluded from the entity model. This closes the traceability gap without creating a spurious MODEL006 entry.

---

### W7: UserStories — SCR004_CountdownPage and SCR006_CommunityStandardsPage have only 1 US each (IPE_SPARSE candidate) — OPEN
- **Severity**: warning
- **Location**: `user-stories.md:97-98` (US011 → SCR004, US014 → SCR006)
- **Description**: SCR004 (Countdown) has 1 US (US011_ViewCountdownPage). SCR006 (Community Standards) has 1 US (US014_ViewCommunityStandards). Both are purely static/read-only pages with no interactive elements — the IPE_ZERO case is correctly noted at the bottom of user-stories.md. The warning is that these single-US screens satisfy the ≥1 minimum but are at the lower bound. No fix needed if confirmed static-only.
- **Fix**: Confirm in ScreenList notes that these screens have zero interactive elements beyond page navigation (already implied by description). No change needed — this is observational.

---

### W8: FeatureList — F017_SecretBoxUnlock and F016_KudosSidebar both map US031_UnlockSecretBox — OPEN
- **Severity**: warning
- **Location**: `feature-list.md:617-618` (F017 lists US031), `feature-list.md:585-587` (F016 lists US031)
- **Description**: US031_UnlockSecretBox appears in both F016_KudosSidebar and F017_SecretBoxUnlock Related User Stories. The US Coverage Confirmation table maps US031 → F017_SecretBoxUnlock (correctly). F016 should not also list it. This is a minor instance of the same duplicate-ownership pattern as C5/C6 but for a single US.
- **Fix**: Remove US031 from F016_KudosSidebar's Related User Stories section. F016 owns US032_NavigateToRecipientProfileFromSidebar; F017 owns US031. They are distinct features sharing the same region (REG004_KudosSidebar).

---

## Passed Checks

### BackgroundLogic Cardinality

```
- Inventory total: 0  (NestJS stack; scout sentinel = "_(none found)_")
- Artifact BL count: 0
- Gap: 0% — PASS
- Missing categories: none (all category counts are 0 in inventory)
- Orphan files: none
- Inferred ratio: N/A (stack_inventory_count = 0; guard fires — skip ratio check; signal_inferred_count also 0, no scout self-contradiction)
```

Background-logic.md correctly documents the empty state with two-pass grep verification. No fabricated BL items. Scout sentinel is consistent with artifact.

### Cross-Reference Integrity (Passed)

- [x] All 39 US### exist in UserStories; all referenced in FeatureList Coverage Table with no true orphans
- [x] All SCR### codes in FeatureList exist in ScreenList (SCR001–SCR009 validated)
- [x] All REG### composite refs in FeatureList and Permissions validated against ScreenList Regions subsections
- [x] All MODEL### (MODEL001–MODEL005) referenced in FeatureList exist in DataModel
- [x] All PERM### (PERM001–PERM007) referenced in FeatureList exist in Permissions
- [x] All ROUTE### references in Permissions exist in RouteList
- [x] All SCR### references in Permissions exist in ScreenList (including composite SCR###/REG### refs)
- [x] Every SCR### in ScreenList appears in ScreenFlow — 9/9 screens documented
- [x] No circular navigation dependencies in ScreenFlow
- [x] No REG### in W1 artifacts (SystemOverview, RouteList, DataModel) — W1 no-REG rule satisfied
- [x] No bare REG### codes (all appear as SCR###/REG###) — REG namespace rule satisfied
- [x] No REG-inside-REG nesting detected
- [x] All composite SCR###/REG### refs parse correctly (left token SCR### exists in ScreenList main index; right token REG### exists in parent screen's Regions subsection) — tokenizer C3 validated for F005, F006, F008, F009, F014, F015, F016, F017, F019, F025, F028, F029, F033, F036, F037, F038, F039 (all REG-referencing features)

### Format Compliance (Passed)

- [x] All F### codes: `F###_NameSlug` format, F001–F039, no gaps or duplicates
- [x] All US### codes: `US###_NameSlug` format, US001–US039, no gaps or duplicates
- [x] All SCR### codes: `SCR###_NameSlug` format, SCR001–SCR009, unique
- [x] All REG### codes: per-screen `REG###_NameSlug`, no anonymous regions
- [x] All PERM### codes: `PERM###_NameSlug` format, PERM001–PERM007, unique
- [x] No BL### codes (vacuously compliant — 0 items)
- [x] No placeholder text `{PLACEHOLDER}` detected in any artifact
- [x] Authorization System Type `hybrid` is a valid value from canonical list
- [x] All PERM type values valid (route-guard ×3, screen-permission ×1, action-permission ×1, data-permission ×1, resource-ownership ×1)
- [x] All feature Type values `ui` — valid (no background or mixed features, consistent with 0 BL items)

### Composite Detection (Passed where applicable)

- [x] H4 short-circuit (tabs → SCR variants): no tab-mutual-exclusion UI found; `ProfileKudosSection` filter is a `<select>` on same endpoint, correctly classified as region filter not H4 tabs
- [x] H5 wizard/stepper: no wizard/stepper signals found
- [x] H6 router-outlet: `kudos/layout.tsx` renders `{children}{modal}` — parallel route shell, not an H6 router-outlet with distinct URL segments; correctly not split
- [x] No `[SIGNAL_INFERRED]` tags in ScreenList — tag-count threshold not reached (0 < max(5, ceil(0.10×9)=1))
- [x] 2-of-3 gate cited for all composite screens (SCR001: H1∧H3; SCR005: H1∧H3; SCR007: H2∧H3; SCR009: H1∧H3)
- [x] Trap 5 (REG owner annotation): all REGs belong to documented composite screens; owner is the parent SCR's feature set (FeatureList maps each REG to a specific F###)

---

## Metrics

| Metric | Value |
|--------|-------|
| Feature Specs | 0 (Wave 7b scope) |
| User Stories | 39 |
| Screens | 9 |
| Background Logic Items | 0 |
| Permissions | 7 |
| Backend Route Rows | 17 |
| Frontend Pages | 10 |
| Data Model Entities | 5 |

---

## Unresolved Questions

1. **`GET /` (AppController@getHello)**: Is this a health-check endpoint that should be kept in RouteList and owned by a dedicated feature, or should it be removed from RouteList as an infrastructure artifact? The resolution determines whether C2 is fixed via new F### or via RouteList exclusion.
2. **REG001_AwardInfoHero (SCR005)**: Is the static hero banner of the Awards page intentionally treated as a separate content zone, or should it be collapsed into the SCR005 description? Researcher input needed to confirm whether any future API integration is planned for this region.
