# Phase 02 — Frontend: Login Page UI

**Status:** Pending | **Priority:** High

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: plans/260518-1645-login-page/clarifications.md

## Design Summary
Dark navy full-screen layout:
- Header: Logo (Sun Annual Awards) top-left, Language selector (VN flag + "VN" + chevron) top-right
- Hero: colorful flowing wave key visual full background, large "ROOT FURTHER" text left-aligned, descriptions, cream/beige "LOGIN With Google" button with Google icon
- Footer: fixed at bottom, "Bản quyền thuộc về Sun© © 2025"

## Files to Create
- `frontend/app/login/page.tsx` — /login route
- `frontend/app/auth/callback/page.tsx` — stores JWT from query param, redirects to /
- `frontend/components/login/login-header.tsx` — logo + language selector
- `frontend/components/login/login-hero.tsx` — key visual + text + login button
- `frontend/components/login/login-footer.tsx` — fixed footer
- `frontend/components/login/language-selector.tsx` — VN/EN dropdown

## Implementation Steps
1. Read node_modules/next/dist/docs/ for Next.js 16 App Router conventions
2. Implement language-selector.tsx (VN default, EN option, localStorage persistence)
3. Implement login-header.tsx
4. Implement login-hero.tsx (login button → window.location.href = 'http://localhost:3000/auth/google', loading state during click)
5. Implement login-footer.tsx
6. Assemble login/page.tsx
7. Implement auth/callback/page.tsx (reads ?token=, saves to localStorage, router.push('/'))
8. Add auth guard to login page: if token exists in localStorage → redirect to /

## Mock Data (from Figma)
- Title: "ROOT FURTHER"
- Description 1: "Bắt đầu hành trình của bạn cùng SAA 2025."
- Description 2: "Đăng nhập để khám phá!"
- Login button: "LOGIN With Google"
- Footer: "Bản quyền thuộc về Sun© © 2025"
- Languages: [{ code: "VN", label: "Tiếng Việt", flag: "🇻🇳" }, { code: "EN", label: "English", flag: "🇬🇧" }]

## Success Criteria
- /login renders matching the MoMorph design
- Language selector toggles VN/EN, persists in localStorage
- Login button navigates to backend OAuth endpoint, shows loading state
- /auth/callback stores JWT and redirects to /
- Already-authenticated users redirected from /login to /
