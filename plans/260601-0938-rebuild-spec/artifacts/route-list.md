# Route List

**Project**: Sun* Kudos
**Generated**: 2026-06-01

## Backend Routes

### File: backend/src/app.controller.ts

> **Note**: `GET /` is an infrastructure/health-check route. It is not user-facing and is excluded from feature mapping. No F### owns this route.

| Method | Path | Handler | Middleware | Category |
|--------|------|---------|------------|----------|
| GET | / | AppController@getHello | none | Infra (non-feature) |

## Excluded Routes

| Method | Path | Reason |
|--------|------|--------|
| GET | / | Infrastructure health-check endpoint (`AppController@getHello`). Returns a static greeting string. Not user-facing; no frontend screen or feature consumes it. Intentionally excluded from feature mapping. |

### File: backend/src/auth/auth.controller.ts

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /auth/google | AuthController@googleAuth | GoogleAuthGuard |
| GET | /auth/google/callback | AuthController@googleCallback | GoogleAuthGuard |

### File: backend/src/kudos/kudos.controller.ts

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /kudos | KudosController@findAll | JwtAuthGuard |
| GET | /kudos/highlight | KudosController@findHighlight | JwtAuthGuard |
| GET | /kudos/spotlight | KudosController@findSpotlight | none |
| GET | /kudos/spotlight/recent | KudosController@findSpotlightRecent | none |
| GET | /kudos/recipient/:email/profile | KudosController@getRecipientProfile | none |
| GET | /kudos/stats | KudosController@getStats | JwtAuthGuard |
| GET | /kudos/profile/:email | KudosController@getProfile | JwtAuthGuard |
| GET | /kudos/:id | KudosController@findOne | JwtAuthGuard |
| POST | /kudos | KudosController@create | JwtAuthGuard |
| POST | /kudos/images | KudosController@uploadImage | JwtAuthGuard |
| POST | /kudos/:id/like | KudosController@like | JwtAuthGuard |
| DELETE | /kudos/:id/like | KudosController@unlike | JwtAuthGuard |

### File: backend/src/users/users.controller.ts

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /users | UsersController@search | JwtAuthGuard |

### File: backend/src/hashtags/hashtags.controller.ts

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /hashtags | HashtagsController@findAll | none |

### File: backend/src/departments/departments.controller.ts

| Method | Path | Handler | Middleware |
|--------|------|---------|------------|
| GET | /departments | DepartmentsController@findAll | none |

## Frontend Routes/Pages

Frontend auth is enforced globally via `AuthGuard` in `app/layout.tsx`.
Public paths (no token required): `/login`, `/countdown`, `/auth/callback`.
All other routes require a valid `auth_token` in localStorage.

### File: frontend/app/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| / | HomePage | required |

### File: frontend/app/login/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /login | LoginPage | public |

### File: frontend/app/auth/callback/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /auth/callback | AuthCallbackPage | public |

### File: frontend/app/countdown/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /countdown | CountdownPage | public |

### File: frontend/app/awards/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /awards | AwardsPage | required |

### File: frontend/app/community-standards/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /community-standards | CommunityStandardsPage | required |

### File: frontend/app/kudos/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /kudos | KudosPage | required |

### File: frontend/app/kudos/[id]/page.tsx

| Path | Component | Auth | Notes |
|------|-----------|------|-------|
| /kudos/:id | KudosDetailPage | required | Direct-URL fallback — renders KudosPage + KudosDetailModal forced open |

### File: frontend/app/kudos/@modal/(.)kudos/[id]/page.tsx

| Path | Component | Auth | Notes |
|------|-----------|------|-------|
| /kudos/:id (intercepted) | KudosDetailIntercepted | required | Parallel route (@modal slot) — intercepts /kudos/:id navigation from within /kudos, renders KudosDetailModal as overlay without full page reload |

### File: frontend/app/profile/[email]/page.tsx

| Path | Component | Auth |
|------|-----------|------|
| /profile/:email | ProfilePage | required |

## Summary

| Category | Count |
|----------|-------|
| Backend Routes | 17 |
| Frontend Pages | 10 |
| Total | 27 |

### Backend Route Breakdown

| Controller | Routes | Auth-Protected | Notes |
|-----------|--------|----------------|-------|
| AppController | 1 | 0 | Infra only — excluded from feature mapping |
| AuthController | 2 | 0 (GoogleAuthGuard, not JWT) | |
| KudosController | 12 | 9 (JwtAuthGuard) | |
| UsersController | 1 | 1 | |
| HashtagsController | 1 | 0 | |
| DepartmentsController | 1 | 0 | |

### Frontend Auth Summary

| Type | Paths |
|------|-------|
| Public (no token) | /login, /countdown, /auth/callback |
| Auth-required (token in localStorage) | /, /awards, /community-standards, /kudos, /kudos/:id, /profile/:email |
