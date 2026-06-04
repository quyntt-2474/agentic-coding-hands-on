# Login Page Implementation Plan

**Status:** In Progress | **Branch:** main | **Date:** 2026-05-18

## MoMorph
- Login screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: plans/260518-1645-login-page/clarifications.md

## Phases

| Phase | File | Status |
|-------|------|--------|
| 01 | phase-01-backend-auth.md | Done |
| 02 | phase-02-frontend-login-page.md | Done |
| 03 | phase-03-integration.md | Done |

## Key Decisions
- Google OAuth2 → JWT (returned in redirect query param) → localStorage
- OAuth flow: browser → `GET /auth/google` → Google → `GET /auth/google/callback` → redirect to `frontend/auth/callback?token=<jwt>` → localStorage → `/`
- Frontend port: 3001 | Backend port: 3000
- Languages: VN (default) + EN
