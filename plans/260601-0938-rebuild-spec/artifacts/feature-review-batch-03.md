---
failed: 15
warnings: 7
result: FAIL
---
# Review Report — Feature Spec Batch 03 (F021–F030)

**Reviewer**: Staff Engineer (automated)
**Date**: 2026-06-01
**Scope**: 10 feature specs — F021_NavigateToProfile, F022_LanguageToggle, F023_NotificationPanel, F024_HomePage, F025_HomeHeroCTA, F026_HomeWidgetButton, F027_AwardsPage, F028_AwardDetailNav, F029_AwardsCTA, F030_CommunityStandardsPage

---

## Summary

| Metric | Value |
|--------|-------|
| Feature specs reviewed | 10 |
| Critical issues | 15 |
| Warnings | 7 |
| Result | **FAIL** |

---

## Critical Issues

### C01: F022 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F022_LanguageToggle/spec.md:78-95`
- **Description**: `SM-001_LanguageSelectorDropdown` block has no `**Linked FR:** FR-###` field. Per code-formats.md, every SM full block requires a `**Linked FR:**` referencing an FR in the same spec.
- **Fix**: Add `**Linked FR:** FR-001` or `FR-002` (both are valid candidates; FR-002 = lang switch triggers UI re-render, FR-003 = persistence are the primary concerns the SM governs).

### C02: F023 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F023_NotificationPanel/spec.md:76-91`
- **Description**: `SM-001_NotificationPanelLifecycle` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-002` (bell click toggles open/closed — FR-002 governs that interaction).

### C03: F024 anonymous REG refs in Screen Flow table — OPEN
- **Severity**: critical
- **Location**: `features/F024_HomePage/spec.md:52-53`
- **Description**: Screen Flow table references `SCR001_HomePage/REG002` and `SCR001_HomePage/REG003` without `_NameSlug`. Checklist rule: "REG###_NameSlug mandatory (no anonymous regions)". ScreenList defines these as `REG002_AwardsGrid` and `REG003_KudosCTA` (screen-list.md:73-74).
- **Fix**: Replace `SCR001_HomePage/REG002` with `SCR001_HomePage/REG002_AwardsGrid` and `SCR001_HomePage/REG003` with `SCR001_HomePage/REG003_KudosCTA`. Also fix line 255 `## Related Artifacts` text.

### C04: F026 BR-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F026_HomeWidgetButton/spec.md:103-120`
- **Description**: `BR-001_WidgetMenuClickOutsideCollapse` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-002` (collapse behavior is integral to the expand/collapse contract governed by FR-002, or FR-001 if framed as a FAB rendering concern).

### C05: F026 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F026_HomeWidgetButton/spec.md:124-146`
- **Description**: `SM-001_WidgetButtonLifecycle` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-002` (SM lifecycle directly models the expand/collapse + RuleModal transitions tied to FR-002 through FR-005).

### C06: F027 BR-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F027_AwardsPage/spec.md:93-110`
- **Description**: `BR-001_ScrollOffsetDesktopVsMobile` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-003` (desktop nav scroll offset) or `FR-004` (mobile nav scroll offset); both are covered by this BR.

### C07: F027 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F027_AwardsPage/spec.md:114-128`
- **Description**: `SM-001_AwardNavActiveState` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-005` (scroll listener updates active item on scroll).

### C08: F027 ALG-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F027_AwardsPage/spec.md:132-151`
- **Description**: `ALG-001_ScrollActiveTracking` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-005`.

### C09: F028 BR-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F028_AwardDetailNav/spec.md:92-108`
- **Description**: `BR-001_ScrollOffsetByViewport` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-003` (scroll offset governs the nav click scroll behavior).

### C10: F028 BR-002 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F028_AwardDetailNav/spec.md:110-119`
- **Description**: `BR-002_MvpLabelTruncation` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-002` (mobile nav rendering of 6 items with MVP truncated).

### C11: F028 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F028_AwardDetailNav/spec.md:123-144`
- **Description**: `SM-001_NavActiveId` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-005` (scroll tracker updates active item passively).

### C12: F028 ALG-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F028_AwardDetailNav/spec.md:148-171`
- **Description**: `ALG-001_ScrollActiveTracking` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-005`.

### C13: F029 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F029_AwardsCTA/spec.md:85-101`
- **Description**: `SM-001_CTANavigation` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-002` (CTA navigates to /kudos — FR-002 directly corresponds).

### C14: F030 BR-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F030_CommunityStandardsPage/spec.md:92-106`
- **Description**: `BR-001_AuthGateRedirect` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-001` (FR-001 = page is auth-gated).

### C15: F030 BR-001 source citation missing line range — OPEN
- **Severity**: critical
- **Location**: `features/F030_CommunityStandardsPage/spec.md:93`
- **Description**: `**Source:** frontend/components/auth/auth-guard.tsx` — no `:start-end` line range. Per code-formats.md and checklist: "line range mandatory" on every BR/SM/ALG/INT Source citation.
- **Fix**: Change to `frontend/components/auth/auth-guard.tsx:13-19` (or the appropriate range covering the `PUBLIC_PATHS` check and `router.replace('/login')` logic). Cross-reference: `auth-guard.tsx` lines 13-19 contain the relevant logic per F024 BR-001 source citation.

### C16: F030 SM-001 missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F030_CommunityStandardsPage/spec.md:110-129`
- **Description**: `SM-001_PageLoadState` block has no `**Linked FR:** FR-###` field.
- **Fix**: Add `**Linked FR:** FR-001` (SM models the auth-check-then-render flow = FR-001).

> Note: C14 and C16 are counted as 2 of the 15 failures; C15 is the 15th.

---

## Warnings

### W01: F021 SM-001 source range omits toggle logic — OPEN
- **Severity**: warning
- **Location**: `features/F021_NavigateToProfile/spec.md:124` (`**Source:** user-profile-dropdown.tsx:14-27`)
- **Description**: The SM describes `Closed → Open` via avatar button click, but the `onClick={() => setOpen((o) => !o)}` toggle is at line 54, outside the cited range 14-27. Lines 14-27 cover state init + click-outside handler only. The source range is partially correct but incomplete.
- **Fix**: Extend to `:14-54` or `:14-67` to include the avatar button `onClick` that drives the Closed↔Open transition.

### W02: F025 SM-001 Linked FR mismatch — OPEN
- **Severity**: warning
- **Location**: `features/F025_HomeHeroCTA/spec.md:120` (`**Linked FR:** FR-003`)
- **Description**: SM-001 models navigation state (OnHomePage → NavigatingToAwards / NavigatingToKudos). `FR-003` = "CTA labels are i18n-aware" — this is a label/display concern, not a navigation concern. The SM should link `FR-001` (awards nav) or `FR-002` (kudos nav).
- **Fix**: Change `**Linked FR:** FR-003` to `**Linked FR:** FR-001` (primary navigation SM governs the awards CTA flow).

### W03: F025 duplicate SC-001/SC-002 codes across Cross-Cutting and US blocks — OPEN
- **Severity**: warning
- **Location**: `features/F025_HomeHeroCTA/spec.md:100-101` (Cross-Cutting) and `:130`, `:159` (US blocks)
- **Description**: SC-001 and SC-002 appear in Cross-Cutting `### Verification` with one `(covers ...)` set, then re-appear inside US003 and US004 `**Verification:**` with different `(covers ...)` sets (SM-001 added). Duplicate SC codes create ambiguity about which coverage is authoritative. The checklist says SC codes appear in "US `**Verification:**` list OR Cross-Cutting `### Verification`" — not both.
- **Fix**: Remove the Cross-Cutting Verification duplicate entries (SC-001 and SC-002) and retain the more complete US-level entries that include SM-001 coverage.

### W04: F024 / F026 claim US005 but FeatureList cross-ref maps US005 to F031 — OPEN
- **Severity**: warning
- **Location**: `feature-list.md:1330` (`US005 → F031_RuleModal`) vs `features/F024_HomePage/spec.md` and `features/F026_HomeWidgetButton/spec.md` (both list US005 in Related Artifacts and US blocks)
- **Description**: The FeatureList US-to-Feature cross-reference table (line 1330) maps `US005_OpenRuleModalFromWidget` exclusively to `F031_RuleModal`. Both F024 and F026 include US005 with full acceptance scenarios and verification. This creates a 3-way ownership conflict. Currently F024 owns the complete BR/SM blocks for US005 — this is the spec that a reviewer would use.
- **Fix**: Align the FeatureList cross-ref table to list all owning features for US005 (F024, F026, F031) or formally designate one as the US home and reference-only from others.

### W05: Spec Documents relative paths wrong in F021–F025, F027–F030 — OPEN
- **Severity**: warning
- **Location**: All specs except F026 — e.g. `features/F021_NavigateToProfile/spec.md:184` (`../system-overview.md`)
- **Description**: All specs at `artifacts/features/F###/spec.md` use `../system-overview.md` etc. in `## Spec Documents`. The correct relative path from within a feature directory is `../../system-overview.md` (one level up from `F###/`, another from `features/`). F026 correctly uses `../../`. The broken links are non-functional in any markdown renderer that resolves relative paths.
- **Fix**: Replace `../` with `../../` in all `## Spec Documents` link paths in F021–F025, F027–F030. F026 is correct as-is.

### W06: F023 Assumptions acknowledges SCR006 bell inconsistency — OPEN
- **Severity**: warning
- **Location**: `features/F023_NotificationPanel/spec.md:182`
- **Description**: The spec notes in Assumptions that `SCR006_CommunityStandardsPage` is NOT listed in F023 related screens yet `SiteHeader` is used on that page (which includes `<NotificationPanel />`). This means the notification bell renders on SCR006 but F023 doesn't claim that screen. The feature-list.md confirms SCR006 is absent from F023 related screens. If the bell intentionally does not render on SCR006, source code should be verified (currently `site-header.tsx:61` shows `{isAuth && <NotificationPanel />}` unconditionally for all auth pages).
- **Fix**: Verify whether `CommunityStandardsPage` uses `SiteHeader` with a variant that suppresses the bell, or add SCR006 to F023 related screens.

### W07: F026 Spec Documents missing Screen Flow entry — OPEN
- **Severity**: warning
- **Location**: `features/F026_HomeWidgetButton/spec.md:196-205`
- **Description**: `## Spec Documents` lists 8 artifacts but omits a `[x/unchecked] [Screen Flow]` entry. The spec has a `## Screen Flow` section with a valid `**See:** ScreenFlow § F026_HomeWidgetButton` cross-reference, so the omission is inconsistent.
- **Fix**: Add `- [x] [Screen Flow](../../screen-flow.md) — F026_HomeWidgetButton` to the Spec Documents list.

---

## Passed Checks

### Mandatory Template Sections
- [x] All 10 specs contain required sections in order: Overview → Why This Exists → Who Uses It → Business Workflow → Screen Flow → Cross-Cutting Logic (6 subsections) → User Stories → Key Entities → Related Artifacts → Spec Documents → Assumptions → Source Code References → Unresolved Questions
- [x] All 6 Cross-Cutting Logic H3 subsections present in all 10 specs (`### Requirements`, `### Business Rules`, `### State Machines`, `### Algorithms`, `### External Integrations`, `### Verification`); empty subsections correctly contain `None.`
- [x] All `### Edge Cases` blocks present under `## User Stories` with ≥3 rows in all 10 specs
- [x] No deprecated H2 headings (`## Requirements`, `## Business Rules`, `## State Machines`, `## Success Criteria`, `## How It Works`) found
- [x] No `## Appendix` heading in any spec

### Business Workflow Depth
- [x] All 10 specs have ≥3 numbered steps in `## Business Workflow`
- [x] Steps reference specific components, functions, and client-side mechanisms (not generic prose)

### Screen Flow Cross-Refs
- [x] All 10 specs have `**See:** ScreenFlow § F###_entry` as first line of `## Screen Flow` (regex match confirmed)
- [x] Screen Route Tables present in all 10 UI-type specs

### BR / SM / ALG / INT Source Citations (verified sample)
- [x] F021 BR-001 `**Source:** user-profile-dropdown.tsx:29-34` — verified: `handleProfile` function at lines 29-34 ✓
- [x] F021 SM-001 `**Source:** user-profile-dropdown.tsx:14-27` — partially correct; state init + click-outside at 14-27, toggle at 54 (flagged as W01)
- [x] F022 BR-001 `**Source:** language-context.tsx:17-18` — verified: localStorage restore guard at lines 17-18 ✓
- [x] F023 BR-001 `**Source:** notification-panel.tsx:7-68` — verified: entire component, no fetch anywhere ✓
- [x] F023 SM-001 `**Source:** notification-panel.tsx:9-20` — verified: state init + click-outside at 9-20 ✓
- [x] F024 BR-002 `**Source:** widget-button.tsx:14-24` — verified: click-outside useEffect at 15-24 ✓
- [x] F026 BR-001 `**Source:** widget-button.tsx:15-24` — verified ✓
- [x] F027 / F028 ALG-001 `**Source:** award-info-section.tsx:113-135` / `:114-127` — verified: scroll tracking logic confirmed ✓
- [x] F030 SM-001 `**Source:** community-standards/page.tsx:1-19` — verified: entire page file at 1-19 ✓

### All Mermaid SM Blocks Use `stateDiagram-v2`
- [x] F021 SM-001: `stateDiagram-v2` ✓
- [x] F022 SM-001: `stateDiagram-v2` ✓
- [x] F023 SM-001: `stateDiagram-v2` ✓
- [x] F024 SM-001: `stateDiagram-v2` ✓
- [x] F025 SM-001: `stateDiagram-v2` ✓
- [x] F026 SM-001: `stateDiagram-v2` ✓
- [x] F027 SM-001: `stateDiagram-v2` ✓
- [x] F028 SM-001: `stateDiagram-v2` ✓
- [x] F029 SM-001: `stateDiagram-v2` ✓
- [x] F030 SM-001: `stateDiagram-v2` ✓

### Pseudocode Blocks
- [x] All pseudocode blocks ≤20 lines; no `{lang}` placeholder fences; no secrets/credentials
- [x] No API keys, tokens, or credentials in any pseudocode

### FR Coverage via SC-### Back-Refs
- [x] F021: FR-001 and FR-002 both covered by SC-001 (Cross-Cutting) and SC-001/SC-002 (US) ✓
- [x] F022: FR-001 covered by SC-001; FR-002 covered by SC-001; FR-003 covered by SC-002/SC-003; BR-001 covered by SC-002/SC-003 ✓
- [x] F023: FR-001 through FR-004 covered by SC-001/SC-002 ✓
- [x] F024: FR-001 through FR-005 covered by SC-001 through SC-003 ✓
- [x] F025: FR-001 through FR-003 covered by SC-001/SC-002 ✓
- [x] F026: FR-001 through FR-005 covered by SC-001 through SC-004 ✓
- [x] F027: FR-001 through FR-006 covered by SC-001 through SC-006 ✓
- [x] F028: FR-001 through FR-006 covered by SC-001 through SC-006 ✓
- [x] F029: FR-001 and FR-002 covered by SC-001/SC-002 ✓
- [x] F030: FR-001 through FR-005 covered by SC-001 through SC-004 ✓

### FeatureList Cross-Reference (F021–F030)
- [x] All 10 F### codes, names, and priorities match FeatureList exactly
- [x] All US###, SCR###, PERM### codes listed in Related Artifacts resolve to entries in their respective artifact files
- [x] MODEL001 (User) referenced by F021 — confirmed in DataModel ✓
- [x] PERM003_FrontendAuthGuard referenced in 8 specs — confirmed in Permissions artifact ✓
- [x] No cross-spec BR/SM/ALG/INT references found (all per-spec scope maintained)

### Key Entities
- [x] All 10 specs have ≥1 row in `## Key Entities` table (non-trivial features have ≥2 rows)
- [x] Static-only features (F023, F026, F027, F028, F029, F030) correctly note "N/A — client-side only" entities

### Source Code References
- [x] All 10 specs have ≥3 entries in `## Source Code References`
- [x] All cited file paths exist in the codebase (verified sample: `user-profile-dropdown.tsx`, `language-context.tsx`, `notification-panel.tsx`, `widget-button.tsx`, `award-info-section.tsx`, `community-standards/page.tsx`)

### Spec Scope Isolation (No Over-Fabricated Logic)
- [x] Batch confirmed as mostly static/presentational features — no fabricated backend logic, no invented API endpoints, no placeholder business rules beyond what source code verifiably contains
- [x] `N/A` justifications used appropriately for background features; no unjustified `N/A` on screen-flow for UI features

---

## Metrics

| Metric | Value |
|--------|-------|
| Feature Specs | 10 |
| User Stories | 14 (US003, US004, US005, US006, US007, US009, US010, US012, US013, US014) |
| BR blocks | 11 |
| SM blocks | 10 |
| ALG blocks | 3 |
| INT blocks | 0 |
| SC verification entries | 26 |
| Source citations verified | 10 (sample) |
| Missing `**Linked FR:**` fields | 14 (C01–C02, C04–C16 excluding C03 and C15) |
| Anonymous REG refs | 2 (F024) |
| Missing line ranges on Source | 1 (F030 BR-001) |
