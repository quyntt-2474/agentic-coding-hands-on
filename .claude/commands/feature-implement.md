---
description: Implement a feature from a plan using TDD against the project's NestJS + Next.js stack
argument-hint: <path to plan report or feature description>
---

Delegate to the `feature-implementer` agent (via the Agent tool) to implement a feature from a plan produced by the `feature-plan-builder` agent. The agent executes the plan's checklist step by step using TDD (red → green → refactor) and the exact tech stack defined in `CLAUDE.md` (NestJS 11 + TypeORM + PostgreSQL + AWS S3 backend; Next.js 16.2.6 + React 19 + Tailwind v4 frontend). It writes real, production-grade code — no mocks or fake data to pass builds.

<plan>$ARGUMENTS</plan>

Pass to the agent:
- The plan report path (or feature description) above as the task.
- Work context: the project git root.
- Reports path: `plans/reports/`.

The agent must:
- Follow the plan's checklist exactly, working test-first.
- Respect the repository's conventions, file-size limits, and migration discipline (no auto-sync).
- Verify after edits (`cd backend && npm run build`, `cd frontend && npm run build`).
- Never ignore failing tests just to pass the build.

Relay the agent's final status and summary back to the user.
