# Implementation Plan — Secret Box Kudos Gating

**Date:** 2026-05-31
**Type:** feature-plan-builder
**Scope:** Frontend-only
**Priority:** Medium
**Status:** Ready for implementation

## Context links

- Brainstorm report (chosen approach): `plans/reports/feature-brainstormer-260531-2138-secret-box-kudos-gating.md`
- Primary component: `frontend/components/kudos/sidebar-stats.tsx`
- i18n strings: `frontend/lib/i18n.ts`
- Type: `frontend/lib/types/kudos.ts` (`KudosStats.kudosReceived: number`)
- Domain reference (read-only): `frontend/components/homepage/rule-modal.tsx:148`

## Overview

Gate the `Mở Secret Box` button on `/kudos`. Button disabled while `kudosReceived < 5`, enabled at `>= 5` (mirrors the existing Rising Hero badge tier). Frontend-only — reuse `stats.kudosReceived` already fetched from `GET /kudos/stats`; no backend, no migration. When disabled, show an i18n hint (native `title` tooltip + optional caption). **Chosen approach: A — inline disabled state** (smallest change, no new component, YAGNI).

## Architecture

- Single client component `SidebarStats` (`"use client"`). No new components, no new data fetch, no new props.
- Data flow unchanged: `useEffect` → `apiFetch<KudosStats>("/kudos/stats")` → `stats` state. Existing guards (`!isAuthed`, `!stats`) run before render body, so inside render `stats` is non-null.
- New derived state: a module-level constant `SECRET_BOX_THRESHOLD = 5` and an in-render boolean `canOpenBox = (stats.kudosReceived ?? 0) >= SECRET_BOX_THRESHOLD`.
- Gating surface: the existing `<button>` gets `disabled`, `aria-disabled`, conditional `title`, and conditional disabled styling. Native browsers do not fire `onClick` on disabled buttons — primary enforcement. `handleOpenGift` is additionally hardened as defense-in-depth.
- Next.js 16.2.6: this is a plain React client-component change (state, conditional attributes/classes). No App Router / RSC / server-action surface touched — no Next-specific pattern needed.

## API design

N/A — no endpoints added or changed. Reuses existing `GET /kudos/stats`.

## Data model & migrations

N/A — no entity, column, relation, or migration changes. Decision C (backend `canOpenSecretBox` flag) was explicitly rejected as out of scope.

## Implementation checklist

- [ ] Add i18n key `secretBoxLockedHint` (VN) in `frontend/lib/i18n.ts` (existing file)
      - Affected part: Vietnamese translations object, near `openGiftButton` (line 106).
      - What it does: adds `secretBoxLockedHint: 'Cần nhận đủ 5 kudos để mở',`.
      - Purpose: provides the VN locked-state hint string consumed by the button tooltip/caption.
      - Why needed: copy must come from the i18n system (`useTranslations`), not be hardcoded in the component.

- [ ] Add i18n key `secretBoxLockedHint` (EN) in `frontend/lib/i18n.ts` (existing file)
      - Affected part: English translations object, near `openGiftButton` (line 246).
      - What it does: adds `secretBoxLockedHint: 'You need at least 5 kudos to open',`.
      - Purpose: provides the EN equivalent so the hint renders correctly in EN locale.
      - Why needed: the shared translations type is inferred from both objects being key-symmetric; omitting one locale breaks the type / leaves a gap. Must land in the same change as the VN key.

- [ ] Define threshold constant in `frontend/components/kudos/sidebar-stats.tsx` (existing file)
      - Affected part: module scope, above the `SidebarStats` function (after imports, ~line 9).
      - What it does: adds `const SECRET_BOX_THRESHOLD = 5;`.
      - Purpose: single named source for the 5-kudos gate.
      - Why needed: avoids a magic number and makes a future threshold change a one-line edit (YAGNI — no config system).

- [ ] Compute `canOpenBox` flag in `frontend/components/kudos/sidebar-stats.tsx` (existing file)
      - Affected part: render body, after the `boxRows` block (~line 55), before `return`.
      - What it does: adds `const canOpenBox = (stats.kudosReceived ?? 0) >= SECRET_BOX_THRESHOLD;`.
      - Purpose: derives the enable/disable decision once for reuse in the button attributes.
      - Why needed: drives `disabled`, `title`, `aria-disabled`, styling, and caption. `?? 0` keeps the box locked if the API ever returns null/undefined for `kudosReceived` (fail-closed).

- [ ] Harden `handleOpenGift` in `frontend/components/kudos/sidebar-stats.tsx` (existing file)
      - Affected part: `handleOpenGift` callback (lines 25–28).
      - What it does: early-returns when the box is locked before showing the toast. Since `canOpenBox` is computed in the render body, read the same condition (e.g. recompute `(stats?.kudosReceived ?? 0) >= SECRET_BOX_THRESHOLD` inside the handler, or close over the derived value).
      - Purpose: ensures the open/toast flow cannot run while gated, even if a click bypasses the disabled attribute (assistive tooling, programmatic dispatch).
      - Why needed: defense-in-depth — the `disabled` attribute is the primary block, but the handler must not assume it.

- [ ] Wire the button in `frontend/components/kudos/sidebar-stats.tsx` (existing file)
      - Affected part: the gold `<button>` (lines 70–90).
      - What it does: adds `disabled={!canOpenBox}`, `aria-disabled={!canOpenBox}`, `title={!canOpenBox ? t.secretBoxLockedHint : undefined}`, and conditional disabled styling appended to `className` (e.g. `${!canOpenBox ? "opacity-50 cursor-not-allowed hover:bg-[#FFEA9E]" : ""}` to suppress the hover-brighten when locked). Keep `onClick={handleOpenGift}` and all existing markup/icon.
      - Purpose: blocks clicks, exposes the disabled state to assistive tech, shows the hover hint, and makes the locked state visually obvious.
      - Why needed: this is the actual gating UX required by the feature.

- [ ] (Optional) Add visible locked caption in `frontend/components/kudos/sidebar-stats.tsx` (existing file)
      - Affected part: directly below the `<button>`, before `<KudosToast .../>`.
      - What it does: when `!canOpenBox`, render `<p className="text-xs text-white/40 text-center">{t.secretBoxLockedHint}</p>`.
      - Purpose: surfaces the hint on touch devices where `title` hover tooltips never appear.
      - Why needed: `title` is hover-only; without this, touch users get no explanation for the disabled button. Include unless product prefers tooltip-only.

## Test checklist

> No test framework is wired for this component today (manual + build verification per brainstorm). If adding automated coverage, use the project's frontend test setup.

- [ ] Manual: user with `kudosReceived < 5` → button is dimmed, non-clickable, `title`/caption shows the hint, no toast fires on click attempt.
- [ ] Manual: user with `kudosReceived === 5` → button enabled (inclusive boundary), original toast fires on click.
- [ ] Manual: user with `kudosReceived > 5` → button enabled, toast fires.
- [ ] Manual: toggle locale VN ↔ EN → correct hint string in each.
- [ ] Manual: loading state (`!stats`) → spinner only, no flash of an enabled button.
- [ ] Manual: not authenticated → `loginRequired` message only, button not rendered.

## Verification checklist

- [ ] `cd frontend && npm run lint` — no lint errors.
- [ ] `cd frontend && npm run build` — TypeScript compiles, no errors (most likely failure mode: `secretBoxLockedHint` missing from one locale → fix by ensuring both objects have it).
- [ ] Confirm no files outside `frontend/components/kudos/sidebar-stats.tsx` and `frontend/lib/i18n.ts` changed; no backend/migration diff.

## Risks & mitigations

- **Disabled button still triggered programmatically / via a11y tooling** → `disabled` + `aria-disabled` + handler early-return (defense-in-depth).
- **`kudosReceived` null/undefined from API** → `?? 0` fail-closed keeps box locked.
- **i18n drift (key added to one locale only)** → add VN + EN in the same change; `npm run build` catches the type mismatch.
- **Threshold becomes configurable later** → single `SECRET_BOX_THRESHOLD` constant; one-line change. Do not build config now (YAGNI).
- **Frontend gate is non-authoritative** → acceptable for current UX-only scope; note in PR that real entitlement enforcement belongs server-side when the actual open-box flow is implemented.

## Success criteria

- `kudosReceived < 5`: button visually disabled, non-clickable, hint visible (tooltip and/or caption), no toast.
- `kudosReceived >= 5`: button fully enabled, original toast behavior unchanged.
- Both VN and EN render the correct hint text.
- `npm run lint` and `npm run build` in `frontend/` pass.
- No backend or migration changes.

## Unresolved questions

- Tooltip-only vs tooltip + visible caption (step 7) — default to including the caption for touch-device coverage unless product says otherwise.
- (Out of scope) Should entitlement be enforced server-side when the real open-box flow is built? Open product follow-up; not blocking.
