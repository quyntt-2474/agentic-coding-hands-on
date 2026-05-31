---
description: Explore the codebase and brainstorm implementation approaches for a new feature before any code is written
argument-hint: <feature description>
---

Delegate to the `feature-brainstormer` agent (via the Agent tool) to explore the relevant codebase, brainstorm implementation approaches, debate trade-offs with the user, and — only after explicit user agreement — write an implementation plan into `plans/reports/`.

<feature>$ARGUMENTS</feature>

Pass to the agent:
- The feature description above as the task.
- Work context: the project git root.
- Reports path: `plans/reports/`.

The agent must:
1. Explore the codebase FIRST (`explore-feature` / `scan-codebase` skill) — never brainstorm blind.
2. Summarize the discovered context for user review.
3. Present 2–3 genuinely different approaches with pros/cons, a recommendation, risks, and edge cases.
4. Ask for explicit agreement before writing anything.
5. Write the plan to `plans/reports/feature-brainstormer-{date}-{slug}.md` only after the user agrees.

It does NOT write feature code. Relay the agent's final status, summary, and plan path back to the user.
