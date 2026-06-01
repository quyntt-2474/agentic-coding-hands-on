---
name: project-rebuild-spec-batch01
description: Recurring issues found in rebuild-spec Wave 7b feature spec reviews for Sun* Kudos F001-F010
metadata:
  type: project
---

Batch 01 review (F001-F010) completed 2026-06-01. Result: FAIL (5 critical, 14 warnings).

**Why:** Specs are generally high quality with real source citations, but systematic issues exist across the batch.

**Recurring patterns to watch for in later batches:**

1. **Spec Documents relative path depth**: Specs at `features/F00N_Name/spec.md` must use `../../` to reference root artifacts. F006-F010 all used `../` (one level too shallow) — critical.

2. **FR ambiguous home**: FR codes declared in Cross-Cutting Requirements table should NOT also appear under a US's `**Requirements fulfilled:**` list. If a US re-lists a cross-cutting FR, it triggers the "ambiguous home" critical rule.

3. **US dual-ownership**: Each US### must be owned by exactly one F###. When a feature enforces another feature's US (e.g., AuthGuard enforcing the Logout US), it should NOT declare that US as a full US block in its own spec — use prose reference only.

4. **Missing Cross-Cutting Verification H3**: The 6th required H3 subsection in `## Cross-Cutting Logic` is `### Verification`. Easy to forget, especially in simpler specs.

5. **Multi-file Source citation**: `**Source:**` in BR/SM/ALG/INT blocks must cite exactly one file:line-range. Using ` and ` to join two file paths is invalid.

6. **Spec Documents Screen List checkbox**: F006-F010 all had `[Screen List]` unchecked despite Related Artifacts listing SCR codes from ScreenList. These should be checked.

**How to apply:** Flag each of the above patterns as critical/warning on first occurrence per spec in subsequent batches (F011+).
