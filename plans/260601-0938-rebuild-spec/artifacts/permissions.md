# Permissions

**Project**: Sun* Kudos
**Generated**: 2026-06-01
**Analysis Scope**: backend/src/auth/*, backend/src/kudos/kudos.controller.ts, backend/src/kudos/kudos.service.ts, frontend/components/auth/auth-guard.tsx, frontend/app/layout.tsx

**Code Format**: All codes MUST follow `PERM###_NameSlug` format (e.g., PERM001_ViewReports, PERM002_EditUsers)

**Permission Types**:
- `route-guard` - Route-level authorization middleware
- `screen-permission` - UI element visibility/enabled rules
- `action-permission` - Button/action execution rules
- `data-permission` - Field-level access control
- `role-based` - Role-based access control rules
- `resource-ownership` - Owner/resource relationship checks
- `field-permission` - Column/field visibility rules
- `api-scope` - API scope/token permission

**Note**: Feature mapping is managed in FeatureList.md. This document contains permission items without direct feature references.

---

## Authorization System Type

**System Type**: `hybrid` (route-guard authentication + resource-ownership check, no roles)

No roles (no admin/manager/moderator). Every authenticated user has identical privileges. Authorization is a two-layer system:

1. **Authentication gate** — JWT Bearer token required on most backend routes; `auth_token` in localStorage checked on all non-public frontend paths by `AuthGuard`.
2. **Resource-ownership gate** — S3 image keys are namespaced per user (`kudos-images/{email}/`); `KudosService.create()` rejects any `imageKey` whose prefix does not match the authenticated sender's email. No other resource-ownership checks exist (any authenticated user may like/unlike any kudos, view any profile).

| System Type | Description | Indicators |
|-------------|-------------|------------|
| `rbac` | Role-Based Access Control | Roles (admin, user, manager), role assignments, permission roles |
| `abac` | Attribute-Based Access Control | Policies, attributes (department, owner, status), dynamic rules |
| `acl` | Access Control List | Explicit user permissions, permission matrices |
| **`ownership`** | Resource Ownership | owner_id, created_by, can_edit rules |
| **`hybrid`** ✓ | Mixed (RBAC + Ownership) | Roles combined with ownership checks |
| `other` | Custom/Other | Custom permission logic |

> Classified as `hybrid` because the system combines a flat authentication guard (no roles — closer to "authenticated vs. unauthenticated") with one resource-ownership rule. Pure `ownership` would imply only owner can read/edit owned records — not the case here (all kudos are globally readable to authenticated users).

**Identified Roles**:
- `authenticated` — any user who has completed Google OAuth and holds a valid JWT (7-day expiry). Sole user class; no sub-roles.
- `unauthenticated` — visitor without token; restricted to public routes only.

---

## Permissions Index

| Code | Name | Type | Enforced At |
|------|------|------|-------------|
| PERM001_BackendJwtRouteGuard | Backend JWT Route Guard | `route-guard` | Backend — NestJS `JwtAuthGuard` (`@UseGuards(JwtAuthGuard)`) |
| PERM002_BackendGoogleOAuthGuard | Backend Google OAuth Guard | `route-guard` | Backend — NestJS `GoogleAuthGuard` on `/auth/google*` |
| PERM003_FrontendAuthGuard | Frontend Auth Guard | `route-guard` | Frontend — `AuthGuard` component in `app/layout.tsx` |
| PERM004_S3ImageKeyOwnership | S3 Image Key Ownership | `resource-ownership` | Backend — `KudosService.create()` inline validation |
| PERM005_AnonymousSenderMasking | Anonymous Sender Data Masking | `data-permission` | Backend — `KudosService.toCard()` |
| PERM006_LikeUniquenessConstraint | Like Uniqueness Per User | `action-permission` | Backend — `KudosService.like()` |
| PERM007_PublicSpotlightAccess | Public Spotlight Data Access | `screen-permission` | Backend — no guard on `/kudos/spotlight*`, `/kudos/recipient/:email/profile` |

---

## PERM001_BackendJwtRouteGuard

**Type**: `route-guard`
**Enforced At**: Backend — NestJS `JwtAuthGuard` via `@UseGuards(JwtAuthGuard)` decorator per handler

### Description

Protects 9 of 12 kudos endpoints, the users search endpoint, and the kudos stats/profile endpoints with JWT Bearer token validation. Token is extracted from `Authorization: Bearer <token>` header via `passport-jwt`. Invalid/expired tokens → 401 Unauthorized. JWT is signed by `JWT_SECRET`, expiry configured via `JWT_EXPIRES_IN` (default `7d`).

Source files:
- `backend/src/auth/guards/jwt-auth.guard.ts` — guard class
- `backend/src/auth/strategies/jwt.strategy.ts` — token extraction + payload validation
- `backend/src/auth/auth.module.ts` — JWT module registration (7d expiry)
- `backend/src/kudos/kudos.controller.ts` — `@UseGuards(JwtAuthGuard)` on 9 handlers

### Related Routes

- (GET) /kudos
- (GET) /kudos/highlight
- (GET) /kudos/stats
- (GET) /kudos/profile/:email
- (GET) /kudos/:id
- (POST) /kudos
- (POST) /kudos/images
- (POST) /kudos/:id/like
- (DELETE) /kudos/:id/like
- (GET) /users

### Related Screens

- SCR007_KudosPage — all data-driven regions require auth
- SCR007_KudosPage/REG001_HighlightSection — `GET /kudos/highlight`
- SCR007_KudosPage/REG003_AllKudosFeed — `GET /kudos`, `POST /kudos`, `POST/DELETE /kudos/:id/like`
- SCR007_KudosPage/REG004_KudosSidebar — `GET /kudos/stats`
- SCR008_KudosDetailModal — `GET /kudos/:id`, `POST/DELETE /kudos/:id/like`
- SCR009_ProfilePage — `GET /kudos/profile/:email`
- SCR009_ProfilePage/REG003_ProfileKudosList — `GET /kudos?sender=` or `?receiver=`

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| authenticated | ✓ | Valid JWT in `Authorization: Bearer` header; token not expired |
| unauthenticated | ✗ | 401 Unauthorized |

### Related Modules

- `backend/src/auth/guards/jwt-auth.guard.ts`
- `backend/src/auth/strategies/jwt.strategy.ts`
- `backend/src/kudos/kudos.controller.ts`
- `backend/src/users/users.controller.ts`

---

## PERM002_BackendGoogleOAuthGuard

**Type**: `route-guard`
**Enforced At**: Backend — NestJS `GoogleAuthGuard` on `/auth/google` and `/auth/google/callback`

### Description

Initiates and completes Google OAuth 2.0 flow. `GET /auth/google` redirects to Google consent screen. `GET /auth/google/callback` receives OAuth code, validates via `GoogleStrategy` (passport-google-oauth20), then issues a JWT and redirects browser to `{FRONTEND_URL}/auth/callback?token={jwt}`. Not a user-facing auth gate — these are machine-redirect routes, not user data routes.

Source files:
- `backend/src/auth/guards/google-auth.guard.ts`
- `backend/src/auth/strategies/google.strategy.ts` — OAuth scopes: `['email', 'profile']`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/auth.service.ts` — `login()` signs JWT

### Related Routes

- (GET) /auth/google
- (GET) /auth/google/callback

### Related Screens

- SCR002_LoginPage — user clicks "Sign in with Google" → browser navigates to `GET /auth/google`
- SCR003_AuthCallback — receives `?token=` from backend redirect, stores in localStorage

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| unauthenticated | ✓ | Open redirect; Google OAuth handles identity verification |
| authenticated | ✓ | Re-login allowed; new token issued |

### Related Modules

- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/strategies/google.strategy.ts`
- `backend/src/auth/guards/google-auth.guard.ts`

---

## PERM003_FrontendAuthGuard

**Type**: `route-guard`
**Enforced At**: Frontend — `AuthGuard` component mounted in `frontend/app/layout.tsx`; runs on every client navigation

### Description

Client-side route guard. On every path change, reads `auth_token` from `localStorage`. If path is not in `PUBLIC_PATHS` (`['/login', '/countdown', '/auth/callback']`) and no token is present → `router.replace('/login')`. Component renders `null` until check completes to prevent flash of protected content.

Note: this is a UX gate only. It does not cryptographically validate the token — backend JWT validation (PERM001) is the authoritative enforcement. An expired or tampered token stored in localStorage will pass the frontend check but fail on API calls.

Source file: `frontend/components/auth/auth-guard.tsx`

### Related Routes

- Frontend: all non-public routes (`/`, `/awards`, `/community-standards`, `/kudos`, `/kudos/:id`, `/profile/:email`)

### Related Screens

- SCR001_HomePage — auth required
- SCR005_AwardsPage — auth required
- SCR006_CommunityStandardsPage — auth required
- SCR007_KudosPage — auth required
- SCR008_KudosDetailModal — auth required
- SCR009_ProfilePage — auth required
- SCR002_LoginPage — exempt (PUBLIC_PATHS)
- SCR003_AuthCallback — exempt (PUBLIC_PATHS)
- SCR004_CountdownPage — exempt (PUBLIC_PATHS)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| authenticated | ✓ | `auth_token` key present in localStorage (value not validated client-side) |
| unauthenticated | ✗ | Redirected to `/login` |

### Related Modules

- `frontend/components/auth/auth-guard.tsx`
- `frontend/app/layout.tsx`

---

## PERM004_S3ImageKeyOwnership

**Type**: `resource-ownership`
**Enforced At**: Backend — `KudosService.create()` in `backend/src/kudos/kudos.service.ts:409-416`

### Description

When creating kudos with image attachments, each S3 key in `dto.imageKeys` must begin with the prefix `kudos-images/{req.user.email}/`. This ensures a user can only attach images they personally uploaded via `POST /kudos/images`. Violation → `BadRequestException('One or more image keys do not belong to the current user')`. Images are scoped to the uploader at upload time: `POST /kudos/images` stores the file at `kudos-images/{req.user.email}/{filename}` (`kudos.controller.ts:133`).

Source files:
- `backend/src/kudos/kudos.service.ts` lines 409–416 (ownership validation)
- `backend/src/kudos/kudos.controller.ts` lines 132–134 (S3 key scoping on upload)

### Related Routes

- (POST) /kudos — triggers ownership check for each imageKey
- (POST) /kudos/images — scopes upload key to authenticated user

### Related Screens

- SCR007_KudosPage/REG003_AllKudosFeed — WriteKudosModal submits `POST /kudos` with optional imageKeys
- SCR007_KudosPage — `POST /kudos/images` called from WriteKudosModal image picker

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| authenticated (owner) | ✓ | All `imageKeys` start with `kudos-images/{user.email}/` |
| authenticated (non-owner) | ✗ | 400 Bad Request if any key belongs to another user |
| unauthenticated | ✗ | Blocked by PERM001 before reaching this check |

### Related Modules

- `backend/src/kudos/kudos.service.ts`
- `backend/src/kudos/kudos.controller.ts`
- `backend/src/s3/s3.service.ts`

---

## PERM005_AnonymousSenderMasking

**Type**: `data-permission`
**Enforced At**: Backend — `KudosService.toCard()` in `backend/src/kudos/kudos.service.ts:74-82`

### Description

When `kudos.isAnonymous === true`, the sender's `name`, `email`, and `picture` are replaced with masked values: `name` → `kudos.senderAlias ?? 'Ẩn danh'`, `email` → `''`, `picture` → `''`. The actual sender's identity is never sent to any client for anonymous kudos. This masking applies to all kudos read endpoints: `GET /kudos`, `GET /kudos/highlight`, `GET /kudos/:id`, `GET /kudos/profile/:email`, etc.

No privilege escalation exists — even the sender themselves receives the masked view when retrieving their own anonymous kudos.

Source file: `backend/src/kudos/kudos.service.ts` lines 74–82

### Related Routes

- (GET) /kudos
- (GET) /kudos/highlight
- (GET) /kudos/:id
- (GET) /kudos/profile/:email

### Related Screens

- SCR007_KudosPage/REG001_HighlightSection — anonymous kudos display masked sender
- SCR007_KudosPage/REG003_AllKudosFeed — anonymous kudos display masked sender
- SCR008_KudosDetailModal — anonymous kudos detail shows masked sender
- SCR009_ProfilePage/REG003_ProfileKudosList — anonymous kudos in profile feed show masked sender

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| authenticated | ✓ (masked) | `isAnonymous=true` → sender identity fields replaced; all other fields visible |
| authenticated | ✓ (full) | `isAnonymous=false` → full sender data returned |
| unauthenticated | — | Blocked by PERM001/PERM003 before reaching read endpoints |

### Related Modules

- `backend/src/kudos/kudos.service.ts`

---

## PERM006_LikeUniquenessConstraint

**Type**: `action-permission`
**Enforced At**: Backend — `KudosService.like()` in `backend/src/kudos/kudos.service.ts:453-466`

### Description

A user may like a given kudos at most once. `KudosService.like()` checks for an existing `Like` record with `{kudosId, userEmail}` before inserting; duplicate → `ConflictException('Already liked')`. The frontend UI reflects this via `likedByMe` boolean on the kudos card DTO. Unlike (`DELETE /kudos/:id/like`) requires an existing like record → `NotFoundException('Not liked')` if not found.

Source file: `backend/src/kudos/kudos.service.ts` lines 453–481

### Related Routes

- (POST) /kudos/:id/like
- (DELETE) /kudos/:id/like

### Related Screens

- SCR007_KudosPage/REG001_HighlightSection — like/unlike button per kudos card
- SCR007_KudosPage/REG003_AllKudosFeed — like/unlike button per kudos card
- SCR008_KudosDetailModal — like/unlike button on detail view
- SCR009_ProfilePage/REG003_ProfileKudosList — like/unlike button per kudos card

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| authenticated | ✓ (like) | No prior `Like` record for `{kudosId, userEmail}` |
| authenticated | ✗ (like) | 409 Conflict — already liked |
| authenticated | ✓ (unlike) | Prior `Like` record exists |
| authenticated | ✗ (unlike) | 404 Not Found — never liked |
| unauthenticated | ✗ | Blocked by PERM001 |

### Related Modules

- `backend/src/kudos/kudos.service.ts`
- `backend/src/database/entities/like.entity.ts`

---

## PERM007_PublicSpotlightAccess

**Type**: `screen-permission`
**Enforced At**: Backend — no `@UseGuards` on `/kudos/spotlight`, `/kudos/spotlight/recent`, `/kudos/recipient/:email/profile`; Frontend — SCR007/REG002 renders without JWT-dependent data

### Description

Three backend endpoints are intentionally public (no `JwtAuthGuard`): spotlight word cloud data, recent spotlight recipients, and recipient hover-card profiles. These feed `SCR007/REG002_SpotlightSection` which is visible to unauthenticated users at the API level. However, `SCR007_KudosPage` itself sits behind the frontend `AuthGuard` (PERM003) — the frontend will never render this section for unauthenticated users in practice. The API-level openness is intentional to allow potential future embedding or public display boards.

Source file: `backend/src/kudos/kudos.controller.ts` lines 57–73 (no `@UseGuards`)

### Related Routes

- (GET) /kudos/spotlight
- (GET) /kudos/spotlight/recent
- (GET) /kudos/recipient/:email/profile

### Related Screens

- SCR007_KudosPage/REG002_SpotlightSection — consumes all three public endpoints

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| authenticated | ✓ | No restriction |
| unauthenticated | ✓ (API) | No backend guard; API-level access allowed |
| unauthenticated | ✗ (UI) | Frontend AuthGuard (PERM003) blocks `/kudos` — unauthenticated users never reach this screen |

### Related Modules

- `backend/src/kudos/kudos.controller.ts`
- `frontend/components/kudos/spotlight-section.tsx`

---

## Summary

- **Total Permission Items**: 7
- **By Type**: route-guard: 3, screen-permission: 1, action-permission: 1, data-permission: 1, resource-ownership: 1, role-based: 0, field-permission: 0, api-scope: 0

---

## Cross-Reference Validation

- [x] All PERM### codes are unique
- [ ] All PERM### codes are referenced in FeatureList.md (verified in Step 8)
- [x] All related route references are valid (confirmed against route-list.md)
- [x] All related screen references are valid (confirmed against screen-list.md; SCR###/REG### composite refs validated)
- [x] All related module references are valid (files confirmed to exist in repo)
- [x] No orphaned permission references
- [x] No BL### references needed (background-logic.md confirmed 0 BL items)
