# CLAUDE.md

Project-level guidance for AI agents. See `README.md` for setup/run instructions and `.claude/rules/` for workflow rules.

## What this is

**Sun\* Kudos** — a peer-recognition board. Users sign in with Google, send kudos to colleagues (message + hashtags + optional image, optional anonymous), like them, and view highlight/spotlight feeds.

Monorepo:
- `backend/` — NestJS 11 + TypeORM + PostgreSQL + AWS S3. Auth = Google OAuth2 → JWT.
- `frontend/` — Next.js 16.2.6 (App Router) + React 19 + Tailwind v4 + Tiptap + d3-cloud.
- `docker-compose.yml` — PostgreSQL 16 (`saa_kudos` db).

## ⚠️ Next.js 16 is NOT the Next.js you know

This repo uses Next.js **16.2.6**, which has breaking changes vs. older versions in your training data — APIs, conventions, and file structure may differ. **Read the relevant guide in `frontend/node_modules/next/dist/docs/` before writing frontend code**, and heed deprecation notices. Do not assume Next.js 13/14 patterns.

## Key conventions

- **Verify after edits**: `cd backend && npm run build` and `cd frontend && npm run build` (or `npm run lint`). Don't leave compile errors.
- **No fake data / mocks to pass builds** — implement real code (see `.claude/rules/development-rules.md`).
- **File naming**: kebab-case for TS files; keep files focused (< ~200 lines, split when larger).
- **Backend**: feature-module layout (`auth/`, `kudos/`, `hashtags/`, `departments/`, `users/`, `s3/`, `database/`). DTOs use `class-validator`; a global `ValidationPipe({ whitelist: true, transform: true })` is set in `main.ts`. Protected routes use `@UseGuards(JwtAuthGuard)`.
- **Database**: TypeORM, `synchronize: false`. Schema changes go through migrations in `backend/src/database/migrations/` — never auto-sync. Runtime config: `database.module.ts`; CLI config: `data-source.ts`.
- **Frontend ↔ backend**: API base URL via `NEXT_PUBLIC_BACKEND_URL`; client helpers in `frontend/lib/api.ts`, JWT handling in `lib/jwt.ts`, i18n (VN/EN) in `lib/i18n.ts`. Sanitize rich-text HTML via `lib/sanitize-html.ts` before render.
- **Images**: upload via `POST /kudos/images` → returns an S3 `key`; store the key on the kudos. Keys are scoped per user (`kudos-images/<email>/`).

## Data model

`User` (email PK) · `Kudos` (sender/receiver → User, message, hashtags, imageKeys[], isAnonymous, senderAlias, likeCount) · `Like` (unique per user+kudos) · `Hashtag` · `KudosHashtag` (M2M join). Full endpoint table in `README.md`.

## Migrations

```bash
cd backend
npm run migration:run                    # apply
npm run migration:revert                 # rollback last
npm run migration:generate -- <Name>     # generate from entity changes
```

## Docs & history

- `docs/journals/` — session journals documenting what was built and why (kudos live board, write-kudos modal). Read these for feature context.
- Plans live in `plans/`, docs in `docs/` — do not create markdown elsewhere unless asked.
