---
name: project-rebuild-spec-batch03
description: Rebuild-spec Wave 7b batch 03 review findings (F021-F030) — missing Linked FR, anonymous REG refs, wrong path depth
metadata:
  type: project
---

Batch 03 (F021–F030) review result: FAIL. 15 critical, 7 warnings.

**Why:** Same systemic `**Linked FR:**` omission as batches 02 and 04 — 14 of 15 criticals are missing Linked FR on BR/SM/ALG blocks. Pattern: specs that place BR/SM/ALG inside US blocks (rather than Cross-Cutting) frequently omit the Linked FR field. Cross-Cutting-placed blocks (F021 BR-001, F022 BR-001) correctly include it; US-block-embedded ones do not.

**How to apply:** On every future batch review, grep for BR/SM/ALG/INT blocks and verify each has `**Linked FR:**` — this is the #1 recurring failure mode across batches 02, 03, and 04.

Other findings:
- F024 anonymous REG refs (`SCR001/REG002` missing NameSlug) — verify ScreenList for canonical REG names before writing Screen Flow tables
- F030 BR-001 source has no line range — all Source citations need `:start-end`
- Wrong Spec Docs relative path (`../` instead of `../../`) in F021-F025, F027-F030; F026 was correct with `../../`
- F024/F026 both claim US005 but FeatureList cross-ref maps it to F031 — US shared ownership needs single-owner declaration in cross-ref table
- Duplicate SC codes in Cross-Cutting and US Verification blocks (F025) — pick one location per SC code

[[project-rebuild-spec-batch02]] [[project-rebuild-spec-batch04]]
