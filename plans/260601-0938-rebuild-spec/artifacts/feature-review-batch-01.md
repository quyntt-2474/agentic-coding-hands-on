---
failed: 5
warnings: 14
result: FAIL
---
# Review Report — Feature Specs Batch 01

**Reviewer**: Staff Engineer (automated)
**Date**: 2026-06-01
**Scope**: F001–F010 feature specs (10 specs)

---

## Summary

| Metric | Value |
|--------|-------|
| Specs reviewed | 10 (F001–F010) |
| Critical issues | 5 |
| Warnings | 14 |
| Result | **FAIL** |

---

## Critical Issues

### C1: F001 — SM-001 Source cites multi-file path (code-formats.md invalid composite Source)
- **Severity**: critical
- **Location**: `features/F001_GoogleAuth/spec.md` — SM-001_AuthFlowLifecycle `**Source:**` line
- **Description**: `**Source:** frontend/components/login/login-hero.tsx:42-49 and backend/src/auth/auth.controller.ts:15-27` — a single SM block's `**Source:**` field contains two files joined by ` and `. Code-formats.md §Valid Code Logic Block Requirements mandates `**Source:** path:start-end` (singular). Reviewer verified: `auth.controller.ts` has only 28 lines total; the cited range `:15-27` corresponds to `googleCallback` (lines 21-27), not 15-27. Additionally, auth.controller.ts line 15 is a blank line / comment, so the range start is slightly off. Two-file source is a structural violation that the checklist treats as critical per the `Source Symbol` multi-symbol-delimiter rule applied analogously to Source file paths.
- **Fix**: Split into two `**Source:**` entries or consolidate to the single file that most directly contains the state machine logic (`login-hero.tsx:41-49` for the frontend transitions, with the backend redirect noted in Description prose only).

### C2: F001 — FR-001 defined in Cross-Cutting but not referenced by any US's `**Requirements fulfilled:**` list
- **Severity**: critical
- **Location**: `features/F001_GoogleAuth/spec.md` — `## Cross-Cutting Logic > ### Requirements`, FR-001
- **Description**: FR-001 (`Login page must check existing token and skip OAuth if already authenticated`) is declared in the cross-cutting Requirements table and is covered by SC-001 in the Cross-Cutting Verification section. However the sole US block (US001_SignInWithGoogle) `**Requirements fulfilled:**` list starts at FR-002, FR-003, FR-004 — FR-001 is never listed under any US. The checklist rule: "Each FR-### appears in exactly one of: a US's `**Requirements fulfilled:**` list OR Cross-Cutting `### Requirements` table." FR-001 IS in the cross-cutting table, which satisfies placement. However the complementary rule requires "Every FR-### declared … MUST be covered by ≥1 SC-### via the `(covers …)` back-ref." SC-001 in the Cross-Cutting Verification does include `(covers FR-001)` so that part passes. BUT the US block references FR-001 in its `**Requirements fulfilled:**` section (`FR-001 (cross-cutting)`) as a secondary reference — this creates ambiguity: FR-001 appears BOTH in Cross-Cutting Requirements table AND is referenced from a US's `**Requirements fulfilled:**` list, which triggers the checklist critical rule: "FR-### appearing BOTH under a US AND under Cross-Cutting → critical (ambiguous home)."
- **Fix**: Remove the `FR-001 (cross-cutting)` bullet from US001_SignInWithGoogle's `**Requirements fulfilled:**` list. FR-001 already lives exclusively in the Cross-Cutting table; the US should reference it only through the `**Rules enforced:**` / `**State transitions:**` narrative, not re-declare it under Requirements fulfilled.

### C3: F003 — US008_LogOut is shared between F003 and F004; US mapped to two features violates single-owner rule
- **Severity**: critical
- **Location**: `features/F003_FrontendAuthGuard/spec.md` — `## User Stories`, `### US008_LogOut`; same US block also appears in `features/F004_Logout/spec.md`
- **Description**: US008_LogOut appears as a full US block (with `**What happens:**`, `**Acceptance Scenarios:**`, `**Requirements fulfilled:**`) in BOTH F003 and F004 specs. feature-list.md §Cross-Reference Validation explicitly maps US008_LogOut to F004_Logout only ("US008_LogOut | F004_Logout"). The FeatureSpec checklist rule states every US### code must be owned by exactly one F###. F003 describing its enforcement role as a US block for US008 is a cross-spec duplication. Additionally, F003's `## Related Artifacts` lists `US008_LogOut` as its user story, which conflicts with the authoritative mapping in feature-list.md.
- **Fix**: Remove the US008_LogOut full US block from F003. Replace with a prose reference inside the Overview or Cross-Cutting `### Requirements` (e.g., "Post-logout enforcement path — see F004_Logout / US008_LogOut"). Update F003's `## Related Artifacts` to remove US008 (F003 has no independent US of its own since it is a cross-cutting guard; the FR/BR/SM blocks are cross-cutting by nature).

### C4: F006 — Spec Documents uses relative path `../system-overview.md` instead of `../../system-overview.md`
- **Severity**: critical
- **Location**: `features/F006_LikeUnlike/spec.md:298` — `## Spec Documents` section, first line
- **Description**: F006–F010 Spec Documents sections use `../system-overview.md`, `../feature-list.md`, etc. (single `../`). F001–F005 correctly use `../../system-overview.md` (double `../`). Feature specs live at `features/F00N_Name/spec.md` — two directory levels deep from the artifacts root — so the correct relative path is `../../`. The single-`../` paths resolve to `features/system-overview.md` which does not exist. This affects F006, F007, F008, F009, and F010 (all use the short paths). The checklist rule: "`**Source:** cites a non-existent file or invalid/unverified range → critical`" applies to Spec Documents cross-ref paths. The error is consistent across 5 specs and constitutes fabricated/unresolvable cross-references.
- **Fix**: Replace `../` with `../../` in every Spec Documents link for F006–F010.

### C5: F010 — Cross-Cutting `### Verification` section absent (required H3 subsection missing)
- **Severity**: critical
- **Location**: `features/F010_WriteKudosModal/spec.md` — `## Cross-Cutting Logic` block
- **Description**: The `## Cross-Cutting Logic` section in F010 contains `### Requirements`, `### Business Rules`, `### State Machines`, `### Algorithms`, `### External Integrations` — but is missing `### Verification`. The checklist mandates 6 required H3 subsections in order: Requirements → Business Rules → State Machines → Algorithms → External Integrations → **Verification**. Empty subsection must contain `None.`. The Verification H3 is entirely absent from F010's Cross-Cutting block. (Note: individual SC-### items appear inside US021_OpenWriteKudosModal, which is correct for US-level verification. But the Cross-Cutting `### Verification` H3 itself must be present, even if empty with `None.`)
- **Fix**: Add `### Verification` followed by `None.` at the end of F010's `## Cross-Cutting Logic` section, between `### External Integrations` (which already ends with `None.`) and `## User Stories`.

---

## Warnings

### W1: F001 — `auth.controller.ts:22-27` actual range is `googleCallback` at lines 22-27, but spec cites `:15-27`
- **Severity**: warning
- **Location**: `features/F001_GoogleAuth/spec.md` — Business Workflow step 5 prose citation
- **Description**: The Business Workflow cites `backend/src/auth/auth.controller.ts:22-27` for `AuthController.googleCallback()`. File verified: `googleCallback` starts at line 22 (`@Get('google/callback')`). Step 5 says line 22-27, which is accurate. However the SM-001 Source cites `:15-27` (see C1 above) — if C1 is fixed, this prose citation stands. No separate action needed beyond resolving C1.

### W2: F001 — `## Spec Documents` Screen Flow and Data Model unchecked without justification note
- **Severity**: warning
- **Location**: `features/F001_GoogleAuth/spec.md:253-258`
- **Description**: `[Screen Flow]` and `[Data Model]` are unchecked. Screen Flow is unchecked with no inline justification. For a P0 auth flow that has a `## Screen Flow` section with a route table, the Screen Flow doc should be checked. Data Model unchecked is correct (no DB write on auth) but the spec already acknowledges this in the note — adding a checked entry with the caveat would be cleaner. Low-risk.

### W3: F002 — `## Key Entities` shows placeholder "none" row instead of being absent
- **Severity**: warning
- **Location**: `features/F002_AuthCallback/spec.md:171-173`
- **Description**: The Key Entities table has a row with literal `(none — no DB reads or writes)` as the entity name and `—` values. The checklist warns: "`## Key Entities` with <3 entities for non-trivial features → warning". For a purely client-side feature this is acceptable, but the placeholder row style diverges from the pattern used in F003 and F004 (which omit the table body row). Minor cosmetic inconsistency.

### W4: F003 — `## Assumptions` note on `checked` state not-reset is a subtle behavioral misstatement
- **Severity**: warning
- **Location**: `features/F003_FrontendAuthGuard/spec.md:203-204`
- **Description**: Assumption states "`checked` is initialized to `false`… It is NOT reset to `false` on subsequent path changes." Code verified (`auth-guard.tsx:11`): `const [checked, setChecked] = useState(false)`. The `useEffect` runs on `pathname` change and either calls `setChecked(true)` again or redirects — it never sets `checked` back to `false`. So the assumption is accurate. However the SM-001 state diagram includes `Checked → Unchecked: pathname changes (re-run useEffect)` which contradicts the assumption. The SM says it re-enters Unchecked but the code and assumption say it doesn't. The SM diagram is misleading.
- **Fix**: Update SM-001 to remove the `Checked → Unchecked` transition, or add a comment that `checked` stays `true` across pathname changes (the useEffect re-runs but never resets checked to false).

### W5: F004 — `## Source Code References` cites `user-profile-dropdown.tsx:1-120` but file may be longer; unverified upper bound
- **Severity**: warning
- **Location**: `features/F004_Logout/spec.md:214`
- **Description**: Source reference lists the full component as lines 1-120. The dropdown was only read to line 50 during this review. The claim is plausible but the upper bound (120) was not verified. Minor; no functional impact.

### W6: F005 — `hashtags` DTO has no `@ArrayMinSize(1)` — spec documents this as an assumption but it is a verifiable backend gap
- **Severity**: warning
- **Location**: `features/F005_SubmitKudos/spec.md:372-373` (Assumptions)
- **Description**: The spec correctly identifies that `CreateKudosDto` lacks `@ArrayMinSize(1)`. This is documented as an assumption and also raised in Unresolved Questions. The `## Spec Documents` checklist item for `[Data Model]` is checked but `CreateKudosDto` is a DTO, not a Data Model entity. This is a real backend validation gap that should be tracked as an action item, not merely an assumption.

### W7: F005 — BR-002_SendButtonDisabledState duplicated between F005 and F010
- **Severity**: warning
- **Location**: `features/F005_SubmitKudos/spec.md` BR-002; `features/F010_WriteKudosModal/spec.md` BR-005
- **Description**: Both F005 (BR-002) and F010 (BR-005) define the same `isSubmitDisabled` logic from `write-kudos-modal.tsx:148-149` with identical pseudocode. This is a duplicate full block with the same `**Source:**` file:line appearing in two specs. The checklist rule: "Same BR/SM/ALG/INT code with `**Source:**` line appearing in 2+ places → critical (duplicate full block; secondary occurrences must be reference-only)." However, the codes differ (BR-002 vs BR-005), which technically avoids the code-collision rule. Still, citing the same source file:line range in two separate full blocks in two specs is a smell; one spec should own the logic and the other should reference it with `BR-### (see F###)` format — though cross-spec references are also flagged as critical. Best resolution: one spec owns this BR and the other omits it or references it by prose only.

### W8: F006 — `## Spec Documents` `[Screen List]` unchecked but Related Artifacts lists SCR codes
- **Severity**: warning
- **Location**: `features/F006_LikeUnlike/spec.md:304`
- **Description**: `[Screen List]` is unchecked in Spec Documents despite Related Artifacts listing `SCR007_KudosPage/REG001_HighlightSection`, `SCR007_KudosPage/REG003_AllKudosFeed`, `SCR008_KudosDetailModal`, `SCR009_ProfilePage/REG003_ProfileKudosList`. Checklist: "`## Spec Documents` unchecked item but `## Related Artifacts` lists codes from that artifact → warning (should be checked)."

### W9: F007 — `## Spec Documents` `[Screen List]` unchecked despite Related Artifacts listing SCR007/REG003
- **Severity**: warning
- **Location**: `features/F007_KudosFeed/spec.md:229`
- **Description**: Same pattern as W8. `[Screen List]` is unchecked but Related Artifacts references `SCR007_KudosPage/REG003_AllKudosFeed`.

### W10: F008 — `## Spec Documents` `[Screen List]` unchecked despite Related Artifacts listing SCR007/REG001
- **Severity**: warning
- **Location**: `features/F008_KudosHighlight/spec.md:286`
- **Description**: Same pattern as W8/W9. `[Screen List]` unchecked; Related Artifacts lists `SCR007_KudosPage/REG001_HighlightSection`.

### W11: F009 — `## Spec Documents` `[Screen List]` unchecked despite Related Artifacts listing SCR007/REG002
- **Severity**: warning
- **Location**: `features/F009_KudosSpotlight/spec.md:328`
- **Description**: Same pattern. `[Screen List]` unchecked; Related Artifacts lists `SCR007_KudosPage/REG002_SpotlightSection`.

### W12: F010 — `## Spec Documents` `[Screen List]` unchecked despite Related Artifacts listing SCR007/REG003
- **Severity**: warning
- **Location**: `features/F010_WriteKudosModal/spec.md:258`
- **Description**: Same pattern. `[Screen List]` unchecked; Related Artifacts lists `SCR007_KudosPage/REG003_AllKudosFeed`.

### W13: F009 — BR-003_AnonymousMaskOnHighlight in F008 references F007's pseudocode via prose ("same toCard() masking logic — see F007 BR-002") — informal cross-spec ref
- **Severity**: warning
- **Location**: `features/F008_KudosHighlight/spec.md` — BR-003_AnonymousMaskOnHighlight pseudocode block
- **Description**: The pseudocode body contains `// same toCard() masking logic — see F007 BR-002`. The checklist flags: "Cross-US reference format: `BR-### (see US###)` — reference-only, no Source block." By extension, cross-spec references using informal prose inside a pseudocode body are a style violation. The comment is informational but the block still has its own `**Source:**` and `**Linked FR:**`, so it's not missing required fields. Severity is warning (style deviation, not a missing required field).

### W14: F010 — US021 priority listed as P0 in spec header but F010 is P1 in feature-list.md
- **Severity**: warning
- **Location**: `features/F010_WriteKudosModal/spec.md:181` — `### US021_OpenWriteKudosModal — Open Write Kudos Modal (Priority: P0)`
- **Description**: US021_OpenWriteKudosModal is declared `Priority: P0` inside the spec. Feature-list.md shows F010_WriteKudosModal as P1. The checklist rule: "Feature name or priority mismatch with FeatureList → critical" applies to the F### header priority, not the US priority. The feature header correctly states `**Priority**: P1`. The US-level priority (P0) may be independently assigned, but the spec-internal US priority should be consistent with the feature's priority tier to avoid confusion. This is a warning-level inconsistency.

---

## Passed Checks

### Section Completeness (all 10 specs)
- [x] All 13 required H2 sections present in order for F001–F010 (Overview, Why This Exists, Who Uses It, Business Workflow, Screen Flow, Cross-Cutting Logic, User Stories, Key Entities, Related Artifacts, Spec Documents, Assumptions, Source Code References, Unresolved Questions)
- [x] All 6 Cross-Cutting H3 subsections present in F001–F009 (Requirements, Business Rules, State Machines, Algorithms, External Integrations, Verification); F010 missing Verification H3 (C5)
- [x] No deprecated H2 headings (`## Requirements`, `## Business Rules`, `## State Machines`, `## Success Criteria`, `## How It Works`) present in any spec
- [x] No `## Appendix` heading in any spec

### Code Format Validity
- [x] All F### codes match feature-list.md entries exactly (F001–F010 code, name, priority confirmed)
- [x] All BR/SM/ALG/INT codes follow `{PREFIX}-###_NameSlug` format; IDs unique within each spec
- [x] All US### codes present in spec match feature-list.md US mapping for each F###
- [x] All SCR###/REG### references follow valid composite format (`SCR###_NameSlug/REG###_NameSlug`)
- [x] All PERM### references in `## Who Uses It` resolve to valid entries in feature-list.md Permissions

### BR/SM/ALG/INT Block Quality
- [x] Every BR/SM/ALG/INT full block has `**Source:** file:line-range` (single-file, verified for sample — see C1 for exception)
- [x] Source citations verified for key blocks: F001 (google.strategy.ts:10-16 ✓, auth.service.ts:9-17 ✓, login/page.tsx:13-17 ✓), F002 (callback/page.tsx:27 ✓, :29 ✓), F003 (auth-guard.tsx:6 ✓, :15 ✓), F004 (user-profile-dropdown.tsx:36-40 ✓), F005 (kudos.service.ts:408-417 ✓, :394-406 ✓, :431-439 ✓, :423 ✓), F006 (kudos.service.ts:453-466 ✓, :468-481 ✓, kudos.controller.ts:141-151 ✓), F007 (kudos.service.ts:142-143 ✓, :148-153 ✓), F008 (kudos.service.ts:218-248 ✓), F009 (kudos.service.ts:251-277 ✓, :279-306 ✓, :29-35 ✓), F010 (write-kudos-modal.tsx citations consistent)
- [x] All SM blocks contain Mermaid `stateDiagram-v2` fenced block
- [x] No pseudocode block exceeds 20 lines
- [x] No secrets or credentials in any pseudocode block
- [x] All `**Linked FR:**` references resolve to FR codes defined within the same spec

### FR Coverage
- [x] Every FR-### declared in Cross-Cutting Requirements or US Requirements fulfilled lists is covered by ≥1 SC-### `(covers …)` back-ref (except for the C2 ambiguous-home issue in F001)
- [x] Every SC-### has a `(covers …)` back-ref to ≥1 code in the same spec
- [x] No SC-### appears in a dedicated top-level section (all inline under US or Cross-Cutting Verification)

### User Story Quality
- [x] All US blocks contain `**What happens:**`, `**Why this priority:**`, `**Independent Test:**`
- [x] All US blocks have `**Acceptance Scenarios:**` with Given/When/Then structure
- [x] `### Edge Cases` present and ≥3 rows in all 10 specs
- [x] `## Key Entities` present with ≥1 entity row (or documented N/A for client-only features)
- [x] `## Source Code References` present with ≥3 entries in all 10 specs
- [x] `## Assumptions` present with ≥2 entries in all 10 specs

### Business Workflow Depth
- [x] All `## Business Workflow` sections contain numbered steps (≥6 steps for F005, F007, F009)
- [x] Steps reference specific file:line citations, entity names, field names
- [x] Screen Route Tables present in all UI/mixed feature `## Screen Flow` sections
- [x] `## Screen Flow` first line matches `**See:** ScreenFlow § F###_*` pattern for all 10 specs

### Cross-Ref Integrity (feature-list.md)
- [x] SCR###, US###, ROUTE###, MODEL###, PERM### codes in each spec match feature-list.md entries for the corresponding F###
- [x] No orphaned codes — all codes referenced in specs appear in authoritative artifacts
- [x] F001/F002/F004 Related Artifacts correctly list `none` for routes (client-only logout/callback)
- [x] F009 correctly declares PERM007_PublicSpotlightAccess (public endpoints, no JWT)

---

## Metrics

| Metric | Value |
|--------|-------|
| Feature Specs Reviewed | 10 |
| Critical Issues | 5 |
| Warnings | 14 |
| Specs with 0 issues | 0 (all have at least 1 warning) |
| Specs with critical issues | 4 (F001×2, F003×1, F006–F010×1 shared path issue, F010×1) |
| Source citations verified via Read | 22 file:line ranges confirmed against actual code |
| Source citations failed verification | 1 (F001 SM-001 multi-file + line-range off-by-one) |
