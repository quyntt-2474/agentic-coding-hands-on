---
name: project-core-docs-review-260601
description: Wave 7a core artifact review findings for Sun* Kudos rebuild-spec (2026-06-01). Key recurring issues: duplicate US ownership across F### sections, compound "or" US titles, missing H1 heading in SystemOverview, orphan route (GET /), Trap-1 visual-only REG.
metadata:
  type: project
---

Core doc review completed 2026-06-01. Result: FAIL — 6 critical, 8 warnings.

**Key findings:**
- `system-overview.md` missing `# System Overview` H1 (required root heading absent)
- `GET /` (AppController) route orphaned — no F### owns it
- REG001_AwardInfoHero (SCR005) visual-only independence — Trap 1 violation
- US017/US029/US033/US038 compound "or" titles ("Like or Unlike") — critical per checklist
- US005/US006 appear in multiple F### Related User Stories sections (F024, F026, F031 for US005; F024, F026 for US006) — Coverage Table is correct, Details sections wrong
- US007–US010 duplicated in F020 and F034 Related User Stories (owned by F021, F004, F022, F023)
- US031 duplicated in F016 and F017 (warning, not critical)

**Why:** Researcher populated F### Related User Stories by topic proximity rather than strict single-ownership. Coverage Confirmation table is authoritative; Feature Details sections must match it.

**How to apply:** When reviewing FeatureList artifacts, cross-check every US listed in a Feature Details section against the Coverage Confirmation table. Any US appearing in more than one Feature Details section is a critical violation even if the coverage table is correct.
