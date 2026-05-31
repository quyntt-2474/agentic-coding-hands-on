---
description: Turn a chosen approach into a detailed, checklist-driven implementation plan
argument-hint: <chosen approach summary or path to brainstorm report>
---

Delegate to the `feature-plan-builder` agent (via the Agent tool) to convert an already-chosen approach into a detailed, checklist-driven implementation plan covering the full lifecycle (architecture → API → data model → code). For every code change the plan states which parts are affected, what the change means, its purpose, and why it is needed. The plan is written to `plans/reports/`.

<approach>$ARGUMENTS</approach>

Pass to the agent:
- The chosen approach (or path to the brainstorm report) above as the task.
- Work context: the project git root.
- Reports path: `plans/reports/`.

The agent must NOT re-debate the approach (that happened during brainstorming) and does NOT write feature code. It produces a phased checklist plan with per-change rationale and affected files.

Relay the agent's final status, summary, and plan path back to the user.
