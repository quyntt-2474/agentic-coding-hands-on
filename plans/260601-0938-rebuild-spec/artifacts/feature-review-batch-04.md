---
failed: 11
warnings: 6
result: FAIL
---
# Review Report — Feature Spec Batch 04

**Reviewer**: Staff Engineer (automated)
**Date**: 2026-06-01
**Scope**: 9 feature specs — F031_RuleModal, F032_CountdownPage, F033_CopyKudosLink, F034_KudosPageShell, F035_RecipientSearchModal, F036_HashtagFilter, F037_DepartmentFilter, F038_SpotlightNameSearch, F039_SendKudosFromSpotlight

---

## Summary

| Metric | Value |
|--------|-------|
| Feature specs reviewed | 9 |
| Critical issues | 11 |
| Warnings | 6 |
| Result | **FAIL** |

---

## Critical Issues

### C1: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F031 (3 blocks) — OPEN
- **Severity**: critical
- **Location**: `F031_RuleModal/spec.md:99,117,132`
- **Description**: `BR-001_MountOnlyWhenOpen`, `BR-002_DoubleRAFTransition`, `SM-001_RuleModalVisibility` all have a `**Source:**` citation but no `**Linked FR:** FR-###` field. The checklist requires every full block to reference ≥1 FR defined in the same spec.
- **Fix**: Add `**Linked FR:** FR-004` to BR-001 (covers mount/unmount guard); `**Linked FR:** FR-004` to BR-002 (animation correctness); `**Linked FR:** FR-003, FR-004` to SM-001.

---

### C2: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F032 (4 blocks) — OPEN
- **Severity**: critical
- **Location**: `F032_CountdownPage/spec.md:89,111,133,156`
- **Description**: `BR-001_EnvDateNullGuard`, `BR-002_CountdownFloorAtZero`, `SM-001_CountdownTimerLifecycle`, `ALG-001_CalcTimeLeft` each have a `**Source:**` block but no `**Linked FR:**` field.
- **Fix**: Add appropriate `**Linked FR:**` per block — e.g., BR-001 → `FR-001, FR-002`; BR-002 → `FR-002`; SM-001 → `FR-002, FR-003`; ALG-001 → `FR-002`.

---

### C3: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F033 (2 blocks) — OPEN
- **Severity**: critical
- **Location**: `F033_CopyKudosLink/spec.md:54,70`
- **Description**: `BR-001_UrlConstruction` and `SM-001_ToastVisibility` in Cross-Cutting Logic have no `**Linked FR:**` field.
- **Fix**: Add `**Linked FR:** FR-002` to BR-001; `**Linked FR:** FR-003` to SM-001.

---

### C4: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F034 (3 blocks) — OPEN
- **Severity**: critical
- **Location**: `F034_KudosPageShell/spec.md:65,83,101`
- **Description**: `BR-001_AuthGuardEnforcement`, `BR-002_ParallelRouteModalSlot`, `SM-001_ModalSlotLifecycle` all lack `**Linked FR:**` fields.
- **Fix**: Add `**Linked FR:** FR-003` to BR-001; `**Linked FR:** FR-002` to BR-002 and SM-001.

---

### C5: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F035 (6 blocks) — OPEN
- **Severity**: critical
- **Location**: `F035_RecipientSearchModal/spec.md:96,114,139,166,180,208,229`
- **Description**: `BR-001_RecipientRequired`, `BR-002_DebounceDelay`, `BR-003_BackendSearchLimit`, `BR-004_SubmitDisabledWithoutRecipient`, `SM-001_RecipientFieldState`, `ALG-001_UserSearchILIKE`, `INT-001_GetUsersSearch` — none carry `**Linked FR:**`.
- **Fix**: Add `**Linked FR:** FR-005` to BR-001 and BR-004; `**Linked FR:** FR-001` to BR-002, BR-003, ALG-001, INT-001; `**Linked FR:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006` to SM-001.

---

### C6: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F036 (4 blocks) — OPEN
- **Severity**: critical
- **Location**: `F036_HashtagFilter/spec.md:95,111,126,147`
- **Description**: `BR-001_HashtagFilterJoinGuard`, `BR-002_CanonicalHashtagMerge`, `BR-003_FilterFallbackSilent`, `SM-001_HashtagFilterState` — none carry `**Linked FR:**`.
- **Fix**: Add `**Linked FR:** FR-002` to BR-001 and BR-003; `**Linked FR:** FR-001` to BR-002; `**Linked FR:** FR-001, FR-002` to SM-001.

---

### C7: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F037 (4 blocks) — OPEN
- **Severity**: critical
- **Location**: `F037_DepartmentFilter/spec.md:98,111,129,145`
- **Description**: `BR-001_DepartmentFilterWhereClause`, `BR-002_CanonicalDepartmentMerge`, `BR-003_DepartmentFilterSilentError`, `SM-001_DepartmentFilterState` — none carry `**Linked FR:**`.
- **Fix**: Same pattern as C6 — add `**Linked FR:** FR-002` to BR-001 and BR-003; `**Linked FR:** FR-001` to BR-002; `**Linked FR:** FR-001, FR-002, FR-003` to SM-001.

---

### C8: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F038 (5 blocks) — OPEN
- **Severity**: critical
- **Location**: `F038_SpotlightNameSearch/spec.md:98,114,126,133,155`
- **Description**: `BR-001_ClientSideSubstringMatch`, `BR-002_EscapeKeyClear`, `BR-003_SearchMaxLength`, `SM-001_SearchTermLifecycle`, `ALG-001_WordCloudScatterLayout` — none carry `**Linked FR:**`.
- **Fix**: Add `**Linked FR:** FR-001` to BR-001, BR-003, ALG-001; `**Linked FR:** FR-002` to BR-002; `**Linked FR:** FR-001, FR-002` to SM-001.

---

### C9: Missing `**Linked FR:**` on all BR/SM/ALG/INT full blocks — F039 (4 blocks) — OPEN
- **Severity**: critical
- **Location**: `F039_SendKudosFromSpotlight/spec.md:116,131,145,168`
- **Description**: `BR-001_ProfileCacheGuard`, `BR-002_RecipientPreFillViaState`, `BR-003_ModalCleanupOnClose`, `SM-001_WriteTargetLifecycle` — none carry `**Linked FR:**`.
- **Fix**: Add `**Linked FR:** FR-001` to BR-001 and BR-003; `**Linked FR:** FR-002` to BR-002; `**Linked FR:** FR-001, FR-002` to SM-001.

---

### C10: Fabricated SCR code `SCR008_WriteKudosModal` — F039 — OPEN
- **Severity**: critical
- **Location**: `F039_SendKudosFromSpotlight/spec.md:49,214`
- **Description**: The Screen Flow table (line 49) and Related Artifacts (line 214) reference `SCR008_WriteKudosModal`, a code that does not exist in ScreenList. The valid code is `SCR008_KudosDetailModal`. `WriteKudosModal` is not a separate SCR entry — it is rendered as an inline component within the spotlight word cloud, not a Next.js route/screen.
- **Fix**: Remove `SCR008_WriteKudosModal` from the Screen Flow table and Related Artifacts. The screen flow for F039 only passes through `SCR007_KudosPage/REG002_SpotlightSection`; the modal is a UI component, not a screen. Update Related Artifacts to remove the stale SCR reference.

---

### C11: Compound `**Source:**` citation in BR-001 — F033 — OPEN
- **Severity**: critical
- **Location**: `F033_CopyKudosLink/spec.md:55`
- **Description**: `BR-001_UrlConstruction` lists three file paths concatenated with " and " in a single `**Source:**` field: `kudos-post-card.tsx:72-75 and kudos-detail-modal.tsx:154-157 and kudos-action-bar.tsx:64-67`. The code-formats spec requires each block to have a single canonical source path. Multi-source blocks are aggregation violations (analogous to the Source Symbol multi-delimiter rule for BL items). The "and" separator meets the whitespace-bounded ` and ` pattern that triggers this rule.
- **Fix**: BR-001 covers the same logic repeated in three places. Canonicalize to the primary definition — use `frontend/components/kudos/kudos-post-card.tsx:72-75` as the sole `**Source:**`. Note the other two occurrences in the Applies-to field or prose description, not in the Source citation.

---

## Warnings

### W1: F036/F037/F038/F039 Spec Documents use `../` instead of `../../` paths — OPEN
- **Severity**: warning
- **Location**: `F036_HashtagFilter/spec.md:206`, `F037_DepartmentFilter/spec.md:206`, `F038_SpotlightNameSearch/spec.md:209`, `F039_SendKudosFromSpotlight/spec.md:223`
- **Description**: F031–F035 correctly use `../../` (specs live two levels deep: `features/FXXX/spec.md`). F036–F039 use `../` which points to the wrong level. Links would resolve to `features/system-overview.md` (non-existent) instead of the artifacts root.
- **Fix**: Replace all `../` with `../../` in Spec Documents sections of F036, F037, F038, F039.

---

### W2: F039 US020 acceptance criterion contradicts implementation — OPEN
- **Severity**: warning
- **Location**: `F039_SendKudosFromSpotlight/spec.md:99-100`
- **Description**: Acceptance criterion states "Recipient field in the modal cannot be cleared (pre-filled context)." BR-002 correctly documents that the ✕ button IS rendered and the lock is NOT implemented. The acceptance scenario is technically incorrect — it describes behavior that does not exist. This is a spec-code discrepancy already flagged in Unresolved Questions but the US block itself states an acceptance criterion that would fail on test.
- **Fix**: Update the US020 acceptance criterion to match the actual behavior: "Recipient field is pre-filled from hover card; user may change or clear the selection." Or add a locked prop to `RecipientSearch` to enforce the criterion.

---

### W3: F033 cross-Cutting `### Business Rules` subsection heading followed immediately by first BR block — OPEN
- **Severity**: warning
- **Location**: `F033_CopyKudosLink/spec.md:52-54`
- **Description**: `### Business Rules` has no separator line or `None.` placeholder before the first BR — it transitions directly to `### BR-001_UrlConstruction`. Likewise `### State Machines` (line 68) goes directly to `### SM-001`. Both subsections lack either `None.` (when empty) or proper prose lead-in. This is a format nit but makes the document harder to parse for automated processors.
- **Fix**: Add a blank line between the subsection heading and the first code block heading, or confirm the format is intentional for the pipeline.

---

### W4: F032 edge case documents NaN rendering as known bad UX without resolution — OPEN
- **Severity**: warning
- **Location**: `F032_CountdownPage/spec.md:191`
- **Description**: The edge case table documents that a malformed `NEXT_PUBLIC_EVENT_DATETIME` (e.g., `"not-a-date"`) will cause `NaN` digits to render in `DigitBox` — visually broken. The spec does not enforce any guard against this in code. The Unresolved Questions also flags this. For a production environment where the env var is externally configured, silent NaN display is a data quality risk.
- **Fix**: Add a `isNaN(targetDate.getTime())` guard in `PrelaunchPage` (after `new Date(envDate)`) and fall back to the zero state. Document this as a new BR or update BR-001.

---

### W5: F035 silent 401 failure on JWT expiry — OPEN
- **Severity**: warning
- **Location**: `F035_RecipientSearchModal/spec.md:234-235`
- **Description**: `INT-001_GetUsersSearch` documents that a 401 from expired JWT falls into the catch block and silently shows an empty dropdown with no error feedback. This means a user mid-composition gets a blank recipient list with no indication that re-authentication is needed, causing silent data loss of their compose state.
- **Fix**: Detect 401 response in the catch block and either show an auth-error toast or trigger the auth redirect. At minimum, surface a non-empty error message in the dropdown rather than the generic "no results" state.

---

### W6: F037 race condition on rapid department selection — OPEN
- **Severity**: warning
- **Location**: `F037_DepartmentFilter/spec.md:184`
- **Description**: The spec documents (and edge cases confirm) that `fetchHighlight` has no debounce and no `AbortController`. Rapid sequential filter selections dispatch multiple concurrent requests; the last `setKudos` call wins regardless of request order. This can render stale data if an earlier slow request resolves after a faster later one.
- **Fix**: Pass an `AbortController` signal to `apiFetch` in `fetchHighlight` and abort the previous request on each new `setActiveDept` / `setActiveHashtag` call. Same issue exists in F036 BR-003 (same `fetchHighlight` function).

---

## Passed Checks

### Source Citations Verified (sample)
- [x] F031 BR-001 `rule-modal.tsx:40-53` — confirmed: `useEffect` with `setMounted` + `cancelAnimationFrame` at those exact lines
- [x] F031 SM-001 `rule-modal.tsx:37-55` — confirmed: state declarations + `useEffect` + `if (!mounted) return null`
- [x] F032 BR-001 `prelaunch-page.tsx:70-81` — confirmed: `envDate` read, `targetDate` construction, `useEffect` with `setInterval` guard
- [x] F032 ALG-001 `prelaunch-page.tsx:13-23` — confirmed: `calcTimeLeft` function body
- [x] F033 BR-001 `kudos-post-card.tsx:72-75` — confirmed: `handleCopyLink` with `origin + /kudos/ + id`
- [x] F033 SM-001 `kudos-post-card.tsx:44-47` — confirmed: `showToast` with 2500ms `setTimeout`
- [x] F034 BR-001 `auth-guard.tsx:6-16` — confirmed: `PUBLIC_PATHS` + `router.replace('/login')` guard
- [x] F034 BR-002 `kudos/layout.tsx:1-14` — confirmed: `KudosLayout({ children, modal })` parallel route composition
- [x] F035 BR-001 `write-kudos-modal.tsx:91-93` — confirmed: `if (!r) next.recipient = t.writeKudosRequiredField`
- [x] F035 BR-003 `users.service.ts:21-27` — confirmed: `search(q, limit=10)` with `.orderBy().take(limit)`
- [x] F035 INT-001 `recipient-search.tsx:48-60` — confirmed: debounce effect with `apiFetch`
- [x] F036 BR-001 `kudos.service.ts:226-231` — confirmed: `innerJoin('k.hashtags', 'kh_filter')` + `andWhere('ht_filter.name = :ht')`
- [x] F036 BR-002 `hashtags.service.ts:6-37` — confirmed: `CANONICAL_HASHTAGS` constant + `findAll()` merge + sort
- [x] F036 BR-003 `highlight-section.tsx:37-49` — confirmed: `fetchHighlight` with silent catch
- [x] F037 BR-001 `kudos.service.ts:233-235` — confirmed: `andWhere('receiver.department = :dept')`
- [x] F038 BR-001 `spotlight-word-cloud.tsx:235,304-306` — confirmed: `lowerSearch` + `includes` + opacity/fill assignment
- [x] F038 BR-002 `spotlight-search.tsx:29-31` — confirmed: `onKeyDown` Escape handler
- [x] F039 BR-001 `spotlight-word-cloud.tsx:417-421` — confirmed: `if (!p) return; setHovered(null); setWriteTarget(p)`
- [x] F039 BR-002 `write-kudos-modal.tsx:36` — confirmed: `useState(initialRecipient ?? null)`
- [x] F039 BR-003 `spotlight-word-cloud.tsx:440-451` — confirmed: `onClose={() => setWriteTarget(null)}` render block

### Section Completeness
- [x] All 9 specs have all 13 required sections in correct order (Overview through Unresolved Questions)
- [x] All Cross-Cutting Logic subsections present with either content or `None.`
- [x] All specs have `### Edge Cases` under `## User Stories`
- [x] All specs have `## Key Entities` with ≥1 row
- [x] All specs have `## Source Code References` with ≥3 entries
- [x] All US blocks contain `**What happens:**`, `**Why this priority:**`, `**Independent Test:**`, `**Acceptance Scenarios:**`, `**Requirements fulfilled:**`

### Feature List Cross-Reference
- [x] F031 — name "Community Rules Modal", priority P3, type ui — matches FeatureList exactly
- [x] F032 — name "Pre-launch Countdown Page", priority P3, type ui — matches FeatureList exactly
- [x] F033 — name "Copy Kudos Permalink", priority P3, type ui — matches FeatureList exactly
- [x] F034 — name "Kudos Page Shell", priority P2, type ui — matches FeatureList exactly
- [x] F035 — name "Recipient Search in Write Kudos Modal", priority P1, type ui — matches FeatureList exactly
- [x] F036 — name "Highlight Feed Hashtag Filter", priority P2, type ui — matches FeatureList exactly
- [x] F037 — name "Highlight Feed Department Filter", priority P2, type ui — matches FeatureList exactly
- [x] F038 — name "Spotlight Name Search (Client Filter)", priority P2, type ui — matches FeatureList exactly
- [x] F039 — name "Send Kudos Prefilled from Spotlight", priority P2, type ui — matches FeatureList exactly

### US/Screen Cross-Reference
- [x] All US codes in specs (US005, US011, US030, US034, US039, US007–US010, US023, US015–US016, US018, US020) exist in UserStories artifact and match FeatureList mapping
- [x] All SCR### codes (except C10 finding) resolve to valid ScreenList entries
- [x] Screen Flow first line follows `**See:** ScreenFlow § F###_Entry` pattern in all 9 specs

### State Machine Format
- [x] All SM blocks contain `stateDiagram-v2` fenced Mermaid blocks (F031 SM-001, F032 SM-001, F033 SM-001, F034 SM-001, F035 SM-001, F036 SM-001, F037 SM-001, F038 SM-001, F039 SM-001)
- [x] No pseudocode block exceeds 20 lines
- [x] No secrets or credentials in pseudocode

### Scope ID Uniqueness
- [x] All BR/SM/ALG/INT/FR/SC codes are locally unique within each spec
- [x] No cross-spec references (all Linked FR fields would reference same-spec FRs when added)

---

## Metrics

| Metric | Value |
|--------|-------|
| Feature specs reviewed | 9 |
| BR/SM/ALG/INT blocks found | ~36 total across 9 specs |
| Blocks missing `**Linked FR:**` | 36 (100%) |
| Source citations sampled/verified | 20 |
| Source citations invalid | 0 |
| Fabricated SCR codes | 1 (F039) |
| Compound Source citations | 1 (F033 BR-001) |
| Spec Documents path errors | 4 specs (F036–F039) |

---

## Unresolved Questions

1. The `BR-001_UrlConstruction` compound-source issue (C11) could alternatively be resolved by splitting into three separate BRs (one per surface) — but given the logic is identical across surfaces, a single canonical BR with one source path and prose noting the other occurrences is the preferred pattern. Confirm with pipeline maintainer.
2. F039 `SCR008_WriteKudosModal` may reflect intent to document `WriteKudosModal` as a distinct screen in a future iteration. If so, the ScreenList must be updated first before this ref can be valid.
