---
name: rebuild-spec-batch02-review
description: Recurring issues found in F011-F020 specs (batch 02 review): systematic SM Linked FR missing, ambiguous-home FRs, ALG fabricated labels
metadata:
  type: project
---

Batch 02 (F011–F020) review result: **FAIL** — 18 criticals, 7 warnings.

**Why:** Same systematic `**Linked FR:**` omission pattern as Batch 04 (see [[rebuild-spec-batch04-review]]), but scope is SM-only here; BR/ALG/INT blocks in this batch were correct. Also new pattern: FR ambiguous home (FR in both Cross-Cutting `### Requirements` AND US `**Requirements fulfilled:**`) found in F016, F017, F018, F019.

**How to apply:**
- Flag every SM block during review for missing `**Linked FR:**` — this is the single most common critical across all batches.
- Features with only one US where all FRs are in Cross-Cutting `### Requirements` are almost always ambiguous-home violations; those FRs should live exclusively under the US.
- ALG blocks that say "exact values in X — not read in this spec" are a red flag for fabricated pseudocode; always verify ALG pseudocode against the actual source file.

**Key findings:**
- F014 ALG-001: pseudocode rank labels (`'Super Hero'`, `'Rising Star'`) do not exist in source — actual labels are `'Rising Hero'`, `'Warm Spreader'`. Source also lacked line range.
- F016/F017: Secret Box Unlock spec duplicated across two features with near-identical BR and SM — both valid (per-spec scope), but FR ambiguity reveals the features were not cleanly split.
- F016–F019: `## Spec Documents` stale — unchecked RouteList/DataModel/Permissions despite Related Artifacts referencing codes from those artifacts.
