---
name: project-rebuild-spec-batch04
description: Recurring issues found in F031-F039 feature specs (batch 04 review, 2026-06-01); all 9 specs fail on missing Linked FR field
metadata:
  type: project
---

Batch 04 review (F031-F039) resulted in FAIL: 11 critical issues, 6 warnings.

**Fact:** Every single BR/SM/ALG/INT block across all 9 specs (36 total) is missing the mandatory `**Linked FR:** FR-###` field. This is a pipeline-wide systematic omission — the spec writer template or prompt is not enforcing this field.

**Why:** The `**Linked FR:**` requirement is in the FeatureSpec checklist under "Valid Code Logic Block Requirements (BR / SM / ALG / INT)". The omission pattern suggests the generation prompt does not explicitly inject this requirement, or the LLM consistently drops it.

**How to apply:** When reviewing any future batch, check for `**Linked FR:**` first as a bulk scan before line-level review. A grep for `### BR-` + absence of `Linked FR:` identifies the issue in seconds. Escalate to the spec generation prompt as a systemic fix rather than fixing per-spec.

**Other findings:**
- F039 used `SCR008_WriteKudosModal` — a fabricated SCR code. Correct: `SCR008_KudosDetailModal`. Indicates care needed when specs document modal overlays as "screens" in the Screen Flow table.
- F033 BR-001 had a compound `**Source:**` field with 3 file paths joined by " and " — this triggers the multi-symbol delimiter rule. The pattern is specifically: when the same logic exists at multiple call sites, spec should pick the primary/canonical source and describe others in prose.
- F036/F037/F038/F039 all used `../` instead of `../../` in Spec Documents paths — a copy-paste regression affecting specs in deeper subdirectories. Earlier batch (F031-F035) had this correct.

**Related:** [[project-rebuild-spec-batch01]] — batch 01 had similar path-depth issues; the problem recurs in batch 04 for the later specs only.
