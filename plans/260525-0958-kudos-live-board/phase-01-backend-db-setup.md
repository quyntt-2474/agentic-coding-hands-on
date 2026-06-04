# Phase 01 — Backend: TypeORM + PostgreSQL Setup

**Priority:** Critical (blocks Phase 02)
**Status:** ✅ Done
**Effort:** ~2h

## Context
- Backend: NestJS 11 at `backend/`
- No DB/ORM installed yet; only auth (JWT + Google OAuth)
- Needs PostgreSQL + TypeORM + entities for Kudos domain

## Requirements
- Docker Compose with a Postgres service for local dev
- TypeORM wired into NestJS `AppModule`
- All Kudos-domain entities defined and synced
- `.env.example` updated with DB vars

## Architecture

### Docker Compose (`docker-compose.yml` at repo root)
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: saa_kudos
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

### Entities

**`user.entity.ts`**
```
email       varchar PK
firstName   varchar
lastName    varchar
picture     varchar  (Google avatar URL)
department  varchar  (nullable — not always in Google profile)
stars       int      default 0  (hoa thị count)
createdAt   timestamp
```

**`kudos.entity.ts`**
```
id             uuid PK (generated)
senderEmail    varchar FK → user.email
sender         User (relation)
receiverEmail  varchar FK → user.email
receiver       User (relation)
message        text
likeCount      int default 0   (cached counter, kept in sync with Like table)
createdAt      timestamp
```

**`like.entity.ts`**
```
id           uuid PK
kudosId      uuid FK → kudos.id
kudos        Kudos (relation)
userEmail    varchar FK → user.email
user         User (relation)
UNIQUE(kudosId, userEmail)
```

**`hashtag.entity.ts`**
```
id    int PK (auto-increment)
name  varchar UNIQUE
```

**`kudos-hashtag.entity.ts`** (pivot)
```
kudosId    uuid FK → kudos.id
hashtagId  int FK → hashtag.id
PRIMARY KEY (kudosId, hashtagId)
```

### TypeORM Config in NestJS
- `TypeOrmModule.forRootAsync(...)` using `ConfigService` for env vars
- `synchronize: true` for dev (set to false for prod migrations)
- `entities: [User, Kudos, Like, Hashtag, KudosHashtag]`

## Related Code Files

**Modify:**
- `backend/src/app.module.ts` — add `TypeOrmModule.forRootAsync`
- `backend/.env.example` — add `DATABASE_URL` or individual `DB_*` vars
- `backend/.env` — set local DB credentials

**Create:**
- `docker-compose.yml` (repo root)
- `backend/src/database/entities/user.entity.ts`
- `backend/src/database/entities/kudos.entity.ts`
- `backend/src/database/entities/like.entity.ts`
- `backend/src/database/entities/hashtag.entity.ts`
- `backend/src/database/entities/kudos-hashtag.entity.ts`
- `backend/src/database/database.module.ts`

## Implementation Steps

1. Install packages: `npm i @nestjs/typeorm typeorm pg` in `backend/`
2. Create `docker-compose.yml` at repo root with postgres service
3. Add `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` to `backend/.env.example` and `backend/.env`
4. Create entity files in `backend/src/database/entities/`
5. Create `database.module.ts` exporting `TypeOrmModule.forRootAsync` reading config from `ConfigService`
6. Import `DatabaseModule` in `AppModule`
7. Run `docker compose up -d` and verify connection: `npm run start:dev` in backend
8. Confirm tables are created by checking Postgres: `\dt` in psql

## Todo
- [x] Install `@nestjs/typeorm typeorm pg`
- [x] Create `docker-compose.yml`
- [x] Update `.env.example` with DB vars
- [x] Create User entity
- [x] Create Kudos entity
- [x] Create Like entity
- [x] Create Hashtag entity
- [x] Create KudosHashtag pivot entity
- [x] Wire TypeORM into AppModule
- [x] Start Docker + verify tables sync

## Success Criteria
- `docker compose up -d` starts Postgres without error
- `npm run start:dev` in backend connects to DB (no TypeORM error in logs)
- `\dt` shows all 5 tables: `user`, `kudos`, `like`, `hashtag`, `kudos_hashtag`

## Risk Assessment
- **TypeORM synchronize in dev** — fine for dev; never for prod
- **Entity relation loops** — User ↔ Kudos bidirectional; use `@JoinColumn` carefully
