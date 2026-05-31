---
name: explore-feature
description: "Read and understand the parts of the codebase relevant to a specific feature BEFORE implementing something similar. Produces a structured discovery summary (relevant code, patterns, reusable components, suggested approach, risks, dependencies, next steps). READ-ONLY — never writes feature code. Activate when the user asks to 'explore', 'understand', research existing code, or prepare to build a feature like an existing one."
argument-hint: "[feature-name or feature-description]"
allowed-tools: Glob, Grep, Read, Bash, Task
metadata:
  author: quyntt-2474
  version: "1.0.0"
---

# Explore Feature — Understand the Codebase Before Implementing

A craftsman walks the workshop before picking up a tool. This skill is that walk:
read and understand the parts of the codebase relevant to a feature, then return a
structured discovery summary to prepare for the design / implementation phase.

## Critical Rules

- **READ-ONLY.** NEVER write, edit, or create feature code. Only read, search, and synthesize.
- **No guessing.** Every claim must be backed by a real file/line. Cite `path:line`.
- **Token-efficient.** Read only what is needed; don't read whole large files unnecessarily.
- **Comply** with `.claude/rules/development-rules.md` and the structure in `./docs` when cross-referencing.

## When to Use

- The user is about to implement a feature similar to one that already exists.
- The user asks "how is feature X currently implemented?" or "find code related to X".
- Before `planner` / `tkm:create-plan` builds a plan — to provide input context.
- When you need to know existing patterns, reusable components, or risks before touching code.

## Inputs

- **Required:** the name or description of the feature to build (e.g. "write kudos", "realtime notification").
- **Optional:** an existing similar feature to reference, directory scope (frontend/backend).

If the description is too vague to scope the search, ask 1–2 clarifying questions before starting.

## Workflow

### 1. Scope
- Analyze the feature description → extract keywords, entities, actions (e.g. kudos, comment, react, modal, controller, service, migration).
- Estimate scale: `Glob` by extension + `Grep` by keyword to find where the code lives (frontend/backend/db) and how large it is.

### 2. Search & Read (prefer parallel)
For a large codebase spread across directories → spawn parallel `Explore` subagents, one per zone (e.g. one for `frontend/components`, one for `backend/src`, one for `migrations`/`types`). For a small codebase → `Grep`/`Read` directly.

Each zone should clarify:
- **Relevant code** — files/modules handling a similar feature; degree of relevance.
- **Architecture** — how the code is organized, key abstractions, how components interact.
- **Current implementation** — how the similar feature is built; state management; how API calls are handled.
- **Code style** — naming conventions, file organization, comment style.
- **Reuse** — components / utils / hooks / services that can be reused.
- **Dependencies** — internal (in-repo modules) and external (packages).

**Each subagent prompt MUST specify:** the exact directory zone, keywords to search, and a requirement to return `path:line` + short excerpts. Each subagent has < 200K token context — scope it narrowly.

### 3. Synthesize
- Merge zone results, remove duplicates.
- Cross-reference `./docs` (code-standards, system-architecture) if present.
- Derive an implementation approach consistent with existing patterns (KISS/DRY/YAGNI).
- Surface risks, dependencies, and next steps for the design phase.

### 4. Output the Report
Return the report directly to the user using the exact **Report Format** below.
Optionally save a copy to `plans/reports/explore-{date}-{slug}.md` if the user wants to keep it.

## Report Format

Output exactly this structure, replacing `[Feature Name]` with the real name:

```markdown
# Discovery Summary: [Feature Name]

## Existing Code Found
- [File paths and degree of relevance]  ← include `path:line`

## Patterns to Follow
- [Key patterns identified]

## Reusable Components
- [What can be reused]

## Suggested Approach
- [Recommended implementation approach]
- [Rationale]

## Risks/Challenges
- [Identified issues]

## Dependencies
- [Internal and external dependencies]

## Next Steps
- [What to do in the design/implementation phase]
```

## Quality Bar

- Every "Existing Code Found" entry must have a real `path:line`, never fabricated.
- "Suggested Approach" must follow the patterns found — don't invent a new architecture when unneeded.
- List "Unresolved Questions" at the end if anything remains unclear.
- Finish: do **not** write code — only hand off the report to move into the plan/design phase.
```
