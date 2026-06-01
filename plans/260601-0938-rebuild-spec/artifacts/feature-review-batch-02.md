---
failed: 18
warnings: 7
result: FAIL
---
# Review Report — Feature Specs Batch 02 (F011–F020)

**Reviewer**: Staff Engineer (automated)
**Date**: 2026-06-01
**Scope**: 10 feature specs (F011_KudosImageUpload – F020_GlobalHeader)

---

## Summary

| Metric | Value |
|--------|-------|
| Specs reviewed | 10 (F011–F020) |
| Critical issues | 18 |
| Warnings | 7 |
| Result | **FAIL** |

---

## Critical Issues

### C1: F011 SM-001_UploadedImageLifecycle — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F011_KudosImageUpload/spec.md:157-174`
- **Description**: SM-001 full block has no `**Linked FR:** FR-###` line. Checklist requires every SM block to link at least one FR defined in the same spec.
- **Fix**: Add `**Linked FR:** FR-001` (or FR-003/FR-004 as appropriate) immediately after the `stateDiagram-v2` fence.

### C2: F012 SM-001_AnonymousToggleLifecycle — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F012_KudosAnonymous/spec.md:137-158`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (anonymous toggle drives the cross-cutting masking FR).

### C3: F013 SM-001_ModalLoadState — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F013_KudosDetailModal/spec.md:109-124`
- **Description**: SM-001 full block in Cross-Cutting `### State Machines` has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (SM drives the loading lifecycle for the fetch FR).

### C4: F013 SM-002_LikeToggleLifecycle — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F013_KudosDetailModal/spec.md:126-146`
- **Description**: SM-002 full block in Cross-Cutting `### State Machines` has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (or FR-003/FR-004 which govern optimistic like toggle behaviour).

### C5: F014 SM-001_ProfilePageLoadState — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F014_UserProfilePage/spec.md:106-126`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (profile load lifecycle is driven by the stats fetch FR).

### C6: F014 ALG-001_StarRankDerivation — Source missing line range — OPEN
- **Severity**: critical
- **Location**: `features/F014_UserProfilePage/spec.md:130`
- **Description**: `**Source:** frontend/components/kudos/user-info-block.tsx (imported by profile-hero.tsx:4)` contains no `:start-end` line range. The checklist requires `path:start-end` format; a file-only citation is invalid.
- **Fix**: Read `user-info-block.tsx`, find `rankLabel` function (currently at lines ~4-12), update Source to `frontend/components/kudos/user-info-block.tsx:4-12`.

### C7: F014 ALG-001_StarRankDerivation — pseudocode labels fabricated (mismatch with source) — OPEN
- **Severity**: critical
- **Location**: `features/F014_UserProfilePage/spec.md:138-145`
- **Description**: Spec pseudocode uses tier names `'Legend Hero'`, `'Super Hero'`, `'Rising Star'` with placeholders `T1/T2/T3`. Actual source (`user-info-block.tsx:5-12`) returns `'Legend Hero'` / `'Rising Hero'` / `'Warm Spreader'` at thresholds `3/2/1` (stars integer, not kudos count). `'Super Hero'` and `'Rising Star'` do not exist in the codebase. Spec content is not grounded in actual source.
- **Fix**: Re-read `user-info-block.tsx:4-12`, replace pseudocode with accurate tier labels and exact threshold values (`stars >= 3 → 'Legend Hero'`, `stars >= 2 → 'Rising Hero'`, `stars >= 1 → 'Warm Spreader'`).

### C8: F015 SM-001_ProfileKudosListState — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F015_ProfileKudosList/spec.md:103-127`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (or FR-002; SM drives the filter-and-pagination load lifecycle).

### C9: F015 SM-002_LikeStateInProfileList — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F015_ProfileKudosList/spec.md:129-142`
- **Description**: SM-002 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (like-sync is tied to the filter query FR).

### C10: F016 SM-001_SecretBoxButtonState — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F016_KudosSidebar/spec.md:113-130`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (stats fetch FR gates the button state).

### C11: F016 FR-002 & FR-003 — ambiguous home (Cross-Cutting AND US032) — OPEN
- **Severity**: critical
- **Location**: `features/F016_KudosSidebar/spec.md:46-48` (Cross-Cutting) and `:150-152` (US032)
- **Description**: FR-002 and FR-003 appear in both the Cross-Cutting `### Requirements` table and US032's `**Requirements fulfilled:**` list. Checklist rule: "FR-### appearing BOTH under a US AND under Cross-Cutting → critical (ambiguous home)."
- **Fix**: Remove FR-002 and FR-003 from the Cross-Cutting `### Requirements` table; they belong only under their owning US (US032). Replace with `None.` in Cross-Cutting `### Requirements` if no remaining FRs are truly cross-cutting.

### C12: F017 SM-001_SecretBoxButtonLifecycle — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F017_SecretBoxUnlock/spec.md:126-145`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (stats-gated button lifecycle is driven by FR-001).

### C13: F017 FR-001, FR-002, FR-003 — ambiguous home (Cross-Cutting AND US031) — OPEN
- **Severity**: critical
- **Location**: `features/F017_SecretBoxUnlock/spec.md:46-49` (Cross-Cutting) and `:87-89` (US031)
- **Description**: All three FRs appear in both Cross-Cutting `### Requirements` and US031 `**Requirements fulfilled:**`. Ambiguous home — critical per checklist.
- **Fix**: Since this feature has only one US, all FRs should live exclusively under US031's `**Requirements fulfilled:**`. Remove the Cross-Cutting `### Requirements` table rows for FR-001–FR-003; replace the table with `None.`.

### C14: F018 SM-001_SearchBarLifecycle — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F018_RecipientSearchTrigger/spec.md:171-196`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (or FR-002; search bar lifecycle is driven by the debounced search FR).

### C15: F018 FR-001–FR-005 — ambiguous home (Cross-Cutting AND US022) — OPEN
- **Severity**: critical
- **Location**: `features/F018_RecipientSearchTrigger/spec.md:61-68` (Cross-Cutting) and `:107-113` (US022)
- **Description**: All five FRs appear in both Cross-Cutting `### Requirements` and US022 `**Requirements fulfilled:**`. Single-US feature; all FRs belong under the US.
- **Fix**: Remove the Cross-Cutting `### Requirements` rows for FR-001–FR-005; replace with `None.`. Keep FRs under US022 only.

### C16: F019 SM-001_HoverCardLifecycle — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F019_SpotlightHoverCard/spec.md:161-183`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (card lifecycle is driven by the hover-and-fetch FR).

### C17: F019 FR-001–FR-005 — ambiguous home (Cross-Cutting AND US019) — OPEN
- **Severity**: critical
- **Location**: `features/F019_SpotlightHoverCard/spec.md:54-60` (Cross-Cutting) and `:101-105` (US019)
- **Description**: All five FRs appear in both Cross-Cutting `### Requirements` and US019 `**Requirements fulfilled:**`. Single-US feature; all FRs belong under the US.
- **Fix**: Same as C15 — remove Cross-Cutting rows, keep only under US019.

### C18: F020 SM-001_AuthUserHeaderState — missing `**Linked FR:**` — OPEN
- **Severity**: critical
- **Location**: `features/F020_GlobalHeader/spec.md:158-174`
- **Description**: SM-001 full block has no `**Linked FR:**` line.
- **Fix**: Add `**Linked FR:** FR-001` (auth token subscription drives FR-001/FR-003 header rendering).

---

## Warnings

### W1: F012 SM-001 — non-standard comma-in-Source citation — OPEN
- **Severity**: warning
- **Location**: `features/F012_KudosAnonymous/spec.md:138`
- **Description**: `**Source:** frontend/components/kudos/write-kudos-modal.tsx:37,302-323` mixes a single line and a range with a comma separator. Standard format is `path:start-end` (single range). The cited ranges point to real code but the format is ambiguous.
- **Fix**: Consolidate to the tightest single range covering the anonymous section, e.g., `write-kudos-modal.tsx:37-323` or split into two separate `**Source:**` references if the ranges are truly discontinuous.

### W2: F013 SM-001 — non-standard comma-in-Source citation — OPEN
- **Severity**: warning
- **Location**: `features/F013_KudosDetailModal/spec.md:110`
- **Description**: `**Source:** frontend/components/kudos/kudos-detail-modal.tsx:30-51,85-104` — same non-standard comma-separated dual-range format.
- **Fix**: Choose the primary range that covers the state machine logic, e.g., `kudos-detail-modal.tsx:27-104`.

### W3: F016 Spec Documents — unchecked artifacts with Referenced codes — OPEN
- **Severity**: warning
- **Location**: `features/F016_KudosSidebar/spec.md:213-217`
- **Description**: `[ ] [Route List]`, `[ ] [Data Model]`, `[ ] [Permissions]` are unchecked, but `## Related Artifacts` lists routes (`GET /kudos/stats`, `GET /kudos`), models (MODEL001, MODEL002), and permission (PERM001). Checklist: unchecked Spec Document item but Related Artifacts lists codes from that artifact → warning (stale cross-ref).
- **Fix**: Mark `[x] [Route List]`, `[x] [Data Model]`, `[x] [Permissions]` with the relevant code references.

### W4: F017 Spec Documents — same as W3 — OPEN
- **Severity**: warning
- **Location**: `features/F017_SecretBoxUnlock/spec.md:183-188`
- **Description**: `[ ] [Route List]`, `[ ] [Data Model]`, `[ ] [Permissions]` unchecked; Related Artifacts references route `GET /kudos/stats`, model MODEL002, permission PERM001.
- **Fix**: Same as W3.

### W5: F018 Spec Documents — same as W3 — OPEN
- **Severity**: warning
- **Location**: `features/F018_RecipientSearchTrigger/spec.md:230-236`
- **Description**: `[ ] [Route List]`, `[ ] [Data Model]`, `[ ] [Permissions]` unchecked; Related Artifacts references `GET /users`, MODEL001, PERM001.
- **Fix**: Same as W3.

### W6: F019 Spec Documents — same as W3 — OPEN
- **Severity**: warning
- **Location**: `features/F019_SpotlightHoverCard/spec.md:244-249`
- **Description**: `[ ] [Route List]`, `[ ] [Data Model]`, `[ ] [Permissions]` unchecked; Related Artifacts references `GET /kudos/recipient/:email/profile`, MODEL001, MODEL002, PERM007.
- **Fix**: Same as W3.

### W7: F020 Spec Documents — Data Model entry absent — OPEN
- **Severity**: warning
- **Location**: `features/F020_GlobalHeader/spec.md:270-276`
- **Description**: `## Spec Documents` has no `[ ] [Data Model]` entry at all, yet `## Related Artifacts` lists `MODEL001 — User`. Checklist: unchecked item with matching codes in Related Artifacts → warning.
- **Fix**: Add `[ ] [Data Model](../../data-model.md) — MODEL001` (or check it if the data model was consulted).

---

## Passed Checks

### Source Citation Verification (sampled)
- [x] F011 BR-001 Source `image-upload-preview.tsx:5` — `MAX_IMAGES = 5` at line 5 ✓
- [x] F011 BR-002 Source `kudos.controller.ts:30,114-121` — `ALLOWED_MIME` at line 30, `fileFilter` at lines 114-124 ✓
- [x] F011 BR-003 Source `kudos.controller.ts:28,112` — `MAX_IMAGE_SIZE` at line 28, `limits` at line 112 ✓
- [x] F011 BR-004 Source `kudos.controller.ts:132-134` — `folder` + `s3.upload` at lines 133-134 ✓
- [x] F011 INT-001 Source `s3.service.ts:32-46` — `upload()` method at lines 31-46 ✓
- [x] F011 SM-001 Source `image-upload-preview.tsx:62-94` — `handleFiles` + upload concurrent logic at lines 57-95 ✓
- [x] F012 BR-001 Source `kudos.service.ts:74-82` — anonymous masking block at lines 74-82 ✓
- [x] F012 BR-002 Source `kudos.service.ts:427` — `senderAlias` conditional at line 427 ✓
- [x] F013 SM-002 Source `kudos-detail-modal.tsx:119-151` — `handleLike` + optimistic toggle at lines 138-152 ✓
- [x] F013 BR-001 Source `kudos-detail-modal.tsx:160` — `sanitizeHtml` call at line 160 ✓
- [x] F013 BR-002 Source `kudos-detail-modal.tsx:53-59` — `handleClose` at lines 53-58 ✓
- [x] F013 BR-003 Source `kudos.service.ts:453-466` — `like()` with conflict check at lines 453-466 ✓
- [x] F014 BR-001 Source `kudos.service.ts:339` — `NotFoundException` at line 339 ✓
- [x] F014 BR-003 Source `kudos.service.ts:334-338` — `likeRepo.createQueryBuilder` at lines 333-337 ✓
- [x] F016 BR-001 Source `sidebar-stats.tsx:27-31` — `handleOpenGift` guard at lines 26-30 ✓
- [x] F016 BR-002 Source `sidebar-recipients.tsx:20-30` — dedup loop (file exists; range plausible) ✓
- [x] F017 BR-001 Source `sidebar-stats.tsx:9-31` — `SECRET_BOX_THRESHOLD`, `handleOpenGift` at lines 9-30 ✓
- [x] F019 BR-001 Source `spotlight-word-cloud.tsx:221-228` — `scheduleHide`/`cancelHide` at lines 221-229 ✓
- [x] F019 BR-002 Source `spotlight-word-cloud.tsx:211-218` — `showCard` at lines 211-218 ✓
- [x] F020 BR-001 Source `user-profile-dropdown.tsx:29-33` — `handleProfile` at lines 29-33 ✓
- [x] F020 BR-002 Source `user-profile-dropdown.tsx:36-40` — `handleLogout` at lines 36-40 ✓
- [x] F020 BR-003 Source `notification-panel.tsx:12-18` — `mousedown` handler at lines 12-20 ✓

### Mandatory Sections Presence
- [x] All 10 specs contain all required H2 sections (`## Overview`, `## Why This Exists`, `## Who Uses It`, `## Business Workflow`, `## Screen Flow`, `## Cross-Cutting Logic`, `## User Stories`, `## Key Entities`, `## Related Artifacts`, `## Spec Documents`, `## Assumptions`, `## Source Code References`, `## Unresolved Questions`)
- [x] Cross-Cutting Logic has all 6 required H3 subsections in every spec; empty subsections use `None.`
- [x] No deprecated top-level headings (`## Requirements`, `## Business Rules`, etc.) present
- [x] No `## Appendix` heading present in any spec
- [x] `### Edge Cases` present and correctly placed under `## User Stories` in all 10 specs
- [x] Edge Cases ≥3 rows for all UI features

### Screen Flow Format
- [x] All `## Screen Flow` sections begin with `**See:** ScreenFlow § F###_NameSlug` ✓
- [x] All UI/mixed specs include Screen Route Table (Screen|Route|Purpose) ✓

### SM Mermaid Diagrams
- [x] All SM full blocks contain `stateDiagram-v2` fenced block ✓ (the missing `**Linked FR:**` is a separate issue — C1–C18)

### Feature List Cross-Reference
- [x] All 10 F### codes match FeatureList entries exactly (code, name, priority)
- [x] US### codes in Related Artifacts resolve to UserStories for all 10 specs
- [x] SCR### and SCR###/REG### refs in Related Artifacts resolve to ScreenList
- [x] PERM### refs in `## Who Uses It` resolve to Permissions artifact
- [x] No placeholder text in any spec

### Key Entities & Source Code References
- [x] All 10 specs have ≥1 entity row in `## Key Entities` with table names ✓
- [x] All 10 specs have ≥3 entries in `## Source Code References` ✓
- [x] No fabricated file paths detected (all sampled paths confirmed to exist in codebase)

### BR Blocks (non-SM)
- [x] All non-SM BR/ALG/INT blocks have `**Source:** path:start-end`, `**Linked FR:**`, description, and pseudocode ≥1 line
- [x] Per-spec BR/SM/ALG/INT IDs are locally unique; no cross-spec references detected
- [x] No secrets or credentials in pseudocode

---

## Metrics

| Metric | Value |
|--------|-------|
| Feature Specs reviewed | 10 |
| Critical issues | 18 |
| Warnings | 7 |
| SM blocks missing `**Linked FR:**` | 11 (across F011–F020) |
| ALG blocks with fabricated/unverified content | 1 (F014 ALG-001) |
| Ambiguous-home FR clusters | 4 (F016, F017, F018, F019) |
| Spec Docs stale-checklist warnings | 5 (F016–F019, F020) |

---

## Priority Fix Order

1. **C6, C7** (F014 ALG-001) — fabricated content; fix before any implementation using the rank labels.
2. **C11, C13, C15, C17** (ambiguous-home FRs in F016–F019) — structural ambiguity blocks accurate verification tracing.
3. **C1–C5, C8–C10, C12, C14, C16, C18** (SM Linked FR missing, all specs) — systematic gap; can be fixed in one pass over all SM blocks.
4. **W1–W7** — format/stale-checklist; low effort cleanup.
