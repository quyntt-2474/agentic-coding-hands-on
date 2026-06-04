# Phase 02 — Backend: Kudos REST API

**Priority:** Critical (blocks Phase 07 integration)
**Status:** ✅ Done
**Effort:** ~3h
**Blocked by:** Phase 01

## Context
- NestJS 11, TypeORM + PostgreSQL (from Phase 01)
- Auth guard already exists (`backend/src/auth/guards/`)
- JWT payload: `{ sub: email, email, firstName, lastName, picture }`

## API Endpoints

### Kudos Module — `GET /kudos`
Query params: `hashtag?: string`, `department?: string`, `page?: number` (default 1), `limit?: number` (default 20)
Response:
```json
{
  "data": [KudosCard],
  "total": 120,
  "page": 1,
  "limit": 20
}
```

### `GET /kudos/highlight`
Returns top 5 kudos ordered by `likeCount DESC`.
Response: `KudosCard[]` (max 5)

### `GET /kudos/spotlight`
Returns all receivers with kudos count for word cloud.
Response: `{ name: string; email: string; count: number }[]`

### `GET /kudos/stats` _(auth required)_
Returns current user's stats from JWT.
Response:
```json
{
  "kudosReceived": 12,
  "kudosSent": 8,
  "heartsReceived": 45,
  "recentRecipients": [{ "email": "...", "name": "...", "picture": "..." }]
}
```
`recentRecipients` = 10 most recently created kudos' receivers (proxy for gift recipients).

### `GET /hashtags`
Returns all distinct hashtags from DB.
Response: `{ id: number; name: string }[]`

### `GET /departments`
Returns all distinct departments from User table.
Response: `string[]`

### `POST /kudos` _(auth required)_
Body: `{ receiverEmail: string; message: string; hashtags: string[] }`
- Upsert receiver into User table (using JWT data for sender)
- Parse hashtags: upsert each into `hashtag` table, link via `kudos_hashtag`
- Returns created `KudosCard`

### `POST /kudos/:id/like` _(auth required)_
- Creates Like row; increments `kudos.likeCount`
- 409 if already liked
- 403 if user is sender of that kudos

### `DELETE /kudos/:id/like` _(auth required)_
- Deletes Like row; decrements `kudos.likeCount`
- 404 if not previously liked

## KudosCard DTO (shared response shape)
```ts
{
  id: string;
  sender: { email: string; name: string; picture: string; department: string; stars: number };
  receiver: { email: string; name: string; picture: string; department: string; stars: number };
  message: string;
  hashtags: string[];
  likeCount: number;
  likedByMe: boolean;   // requires auth; false for unauthenticated
  createdAt: string;    // ISO
}
```

## Architecture

```
backend/src/kudos/
├── kudos.module.ts
├── kudos.controller.ts
├── kudos.service.ts
├── dto/
│   ├── create-kudos.dto.ts
│   ├── kudos-query.dto.ts
│   └── kudos-card.dto.ts
```

```
backend/src/hashtags/
├── hashtags.module.ts
├── hashtags.controller.ts
├── hashtags.service.ts
```

```
backend/src/departments/
├── departments.module.ts
├── departments.controller.ts
├── departments.service.ts
```

## Implementation Steps

1. Generate kudos module: `nest g module kudos && nest g controller kudos && nest g service kudos`
2. Inject `TypeOrmModule.forFeature([Kudos, Like, Hashtag, KudosHashtag, User])` into `KudosModule`
3. Implement `KudosService`:
   - `findAll(query)` — LEFT JOIN hashtags + filter + paginate
   - `findHighlight()` — ORDER BY likeCount DESC LIMIT 5
   - `findSpotlight()` — GROUP BY receiver, COUNT(*)
   - `getStats(userEmail)` — count queries + recent receivers
   - `create(dto, user)` — upsert sender/receiver users, create kudos + hashtag links
   - `like(id, userEmail)` — transaction: insert Like + increment counter
   - `unlike(id, userEmail)` — transaction: delete Like + decrement counter
4. Implement `KudosController` wiring DTOs + guards
5. Generate hashtags + departments modules similarly
6. Apply `JwtAuthGuard` only on `POST /kudos`, `POST /kudos/:id/like`, `DELETE /kudos/:id/like`, `GET /kudos/stats`
7. Add CORS in `main.ts` to allow `http://localhost:3001`
8. Run `npm run start:dev`; test all endpoints with curl/httpie

## Related Code Files

**Create:**
- `backend/src/kudos/kudos.module.ts`
- `backend/src/kudos/kudos.controller.ts`
- `backend/src/kudos/kudos.service.ts`
- `backend/src/kudos/dto/create-kudos.dto.ts`
- `backend/src/kudos/dto/kudos-query.dto.ts`
- `backend/src/kudos/dto/kudos-card.dto.ts`
- `backend/src/hashtags/hashtags.module.ts`
- `backend/src/hashtags/hashtags.controller.ts`
- `backend/src/hashtags/hashtags.service.ts`
- `backend/src/departments/departments.module.ts`
- `backend/src/departments/departments.controller.ts`
- `backend/src/departments/departments.service.ts`

**Modify:**
- `backend/src/app.module.ts` — import KudosModule, HashtagsModule, DepartmentsModule
- `backend/src/main.ts` — enable CORS for `http://localhost:3001`

## Todo
- [x] Generate kudos module/controller/service
- [x] Implement `GET /kudos` with filters + pagination
- [x] Implement `GET /kudos/highlight`
- [x] Implement `GET /kudos/spotlight`
- [x] Implement `GET /kudos/stats` (auth)
- [x] Implement `POST /kudos` (auth)
- [x] Implement `POST /kudos/:id/like` (auth) with 409/403 guards
- [x] Implement `DELETE /kudos/:id/like` (auth)
- [x] Generate hashtags module + `GET /hashtags`
- [x] Generate departments module + `GET /departments`
- [x] Enable CORS in main.ts

## Success Criteria
- All endpoints return correct shapes (verify with curl)
- `GET /kudos/highlight` returns ≤5 results ordered by likeCount
- Like/unlike toggle is idempotent and enforces 1-per-user rule
- Sender cannot like own kudos (403)
- CORS allows frontend at localhost:3001

## Security
- JWT guard on write/stats endpoints — unauthenticated GET endpoints are public (live board is public-facing)
- Validate `receiverEmail` is a valid email in `CreateKudosDto`
- Sanitize message — strip HTML tags
