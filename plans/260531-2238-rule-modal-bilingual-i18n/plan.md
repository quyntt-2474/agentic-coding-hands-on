# Plan — Bilingual (VN/EN) logic for Thể lệ (RuleModal) screen — ✅ DONE

**Discipline:** takumi --auto · **Branch:** feature/PROJ-7-customize-refactor-feature
**Date:** 2026-05-31

## Problem
`components/homepage/rule-modal.tsx` ("Thể lệ") is the only screen with all copy
hardcoded in Vietnamese. Every other component (community-standards, footer, write-kudos)
already consumes the established i18n pattern: `useTranslations()` from `lib/i18n.ts`
keyed by `useLang()` (VN | EN). Provider is mounted at `app/layout.tsx` (root) → wraps RuleModal.

## Goal
Make RuleModal bilingual by wiring it into the existing i18n system. No new infra (DRY/KISS).

## Changes
1. **`frontend/lib/i18n.ts`** — add `rule*` keys to both `VN` and `EN` blocks:
   - `ruleModalTitle`, `ruleRecipientSectionTitle`, `ruleRecipientSectionDesc`
   - Hero levels (4× condition + desc): `ruleHero{New,Rising,Super,Legend}{Condition,Desc}`
   - `ruleSenderSectionTitle`, `ruleSenderSectionDesc`, `ruleSenderRewardNote`
   - `ruleNationalKudosTitle`, `ruleNationalKudosDesc`, `ruleWriteKudosButton`
   - Reuse existing `closeDialog` ('Đóng'/'Close') for close aria + footer close button.
2. **`frontend/components/homepage/rule-modal.tsx`** — `const t = useTranslations();`
   - Replace hardcoded `HERO_LEVELS` condition/desc with key references; keep stable `name` labels.
   - Replace every hardcoded VN string with `t.*`. Keep BADGES (image-only) unchanged.

## Verify
- `cd frontend && npm run lint` (or `npm run build`) — no errors.
- Type-check: `Translations` type derives from `translations.VN`, so EN must mirror VN keys exactly.

## Out of scope
- Backend, badge images, language toggle UI (already exists via LanguageProvider).
