# Secret Box Gating by Kudos Received

**Date:** 2026-05-31
**Type:** feature-brainstormer plan
**Scope:** Frontend-only
**Status:** Approved — ready for implementation

## Problem statement & requirements

The "Open Secret Box" button (`openGiftButton`) in the sidebar stats panel is currently always clickable for any authenticated user. Product wants the box to be **gated**: a user must have received at least **5 kudos** before they can open it.

Requirements (confirmed):
1. **Threshold:** Button is disabled while `stats.kudosReceived < 5`; enabled once it reaches `>= 5`. Mirrors the existing `>= 5` "Rising Hero" badge tier.
2. **Scope:** Frontend-only. Reuse `stats.kudosReceived` already fetched from `GET /kudos/stats`. No backend changes. Existing click behavior (toast on open) stays unchanged — the button is simply blocked when disabled.
3. **Disabled hint:** Show a tooltip/hint when disabled: VN "Cần nhận đủ 5 kudos để mở", with an EN equivalent via `lib/i18n.ts`.

## Codebase context

- **Primary component:** `frontend/components/kudos/sidebar-stats.tsx`
  - `SidebarStats` already loads `stats` via `apiFetch<KudosStats>("/kudos/stats")` (lines 16–23).
  - Guards already exist for not-authed (lines 30–36) and loading (`!stats`, lines 38–44), so inside the render body `stats` is **guaranteed non-null** and `stats.kudosReceived` is a number.
  - The button is at lines 70–90; click handler `handleOpenGift` (lines 25–28) shows a toast.
  - Uses `useTranslations()` (`t`) from `@/lib/i18n` for all copy.
- **i18n:** `frontend/lib/i18n.ts` — VN block around lines 106–111, EN block around lines 246–251. Keys are flat (`openGiftButton`, `kudosReceived`, etc.). A new key must be added to **both** locales to stay type-consistent.
- **Type:** `KudosStats` in `@/lib/types/kudos` — `kudosReceived: number`.
- **Domain reference:** `components/homepage/rule-modal.tsx:148` confirms the Secret Box concept ("Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box"). Threshold here is the product-confirmed `kudosReceived >= 5`.

## Approaches evaluated

### A. Inline disabled state in `sidebar-stats.tsx` (chosen)
Compute a boolean from `stats.kudosReceived`, apply `disabled` + disabled styling to the existing button, guard the click handler, and render a hint when disabled.
- Pros: Smallest change, no new components, reuses already-fetched data, no backend touch. KISS/YAGNI.
- Cons: Adds a few lines to a 130-line file (still well under 200-line limit).

### B. Extract a dedicated `SecretBoxButton` component
Move the button + gating + tooltip into its own component.
- Pros: Reusable if the button appears elsewhere later.
- Cons: No second call site exists today — premature abstraction (YAGNI). More files for no benefit.

### C. Backend-driven `canOpenSecretBox` flag on `/kudos/stats`
Add a computed flag server-side.
- Pros: Single source of truth for the rule.
- Cons: Out of confirmed scope, backend + migration risk, contradicts "frontend-only" decision. Rejected.

**Chosen: Approach A** — simplest, matches confirmed scope, no new abstractions.

## Disable / enable condition logic

```
const SECRET_BOX_THRESHOLD = 5;
const canOpenBox = stats.kudosReceived >= SECRET_BOX_THRESHOLD;
```

- `stats` is non-null inside the render body (the `if (!stats)` guard returns earlier), so no extra null-check needed for the boolean itself.
- Use a defensive fallback only if `kudosReceived` could be undefined from the API: `(stats.kudosReceived ?? 0) >= SECRET_BOX_THRESHOLD`. Keep this since the field is optional-prone across API shapes.
- `handleOpenGift` early-returns when `!canOpenBox` so the box cannot open even if a click slips through.

## Tooltip / hint wiring

- Add i18n key `secretBoxLockedHint`:
  - VN: `'Cần nhận đủ 5 kudos để mở'`
  - EN: `'You need at least 5 kudos to open'`
- Native tooltip via the button's `title={!canOpenBox ? t.secretBoxLockedHint : undefined}` for zero-dependency hover (KISS). Optionally also render a small caption line below the button when disabled for visibility on touch devices.

## Implementation steps (checklist)

- [ ] **1. Add i18n key (VN).** In `frontend/lib/i18n.ts` VN block (near line 106, beside `openGiftButton`), add `secretBoxLockedHint: 'Cần nhận đủ 5 kudos để mở',`.
- [ ] **2. Add i18n key (EN).** In the EN block (near line 246, beside `openGiftButton`), add `secretBoxLockedHint: 'You need at least 5 kudos to open',`. Keep both objects key-symmetric so the translations type stays consistent.
- [ ] **3. Define threshold + flag.** In `sidebar-stats.tsx`, after the `boxRows` block (~line 55), add `const SECRET_BOX_THRESHOLD = 5;` (module-level const above the component is fine) and `const canOpenBox = (stats.kudosReceived ?? 0) >= SECRET_BOX_THRESHOLD;` inside the render body.
- [ ] **4. Guard the handler.** Update `handleOpenGift` (lines 25–28) to early-return when the box is locked. Since `canOpenBox` is computed in the render body, pass the locked state via the handler or recompute; simplest: keep the guard at the button by not invoking when disabled (see step 5) and additionally short-circuit in the handler using a ref/derived value. Minimal approach: rely on the `disabled` attribute (browsers do not fire `onClick` on disabled buttons) plus the visual/title hint.
- [ ] **5. Wire the button (lines 70–90).** Add:
  - `disabled={!canOpenBox}`
  - `title={!canOpenBox ? t.secretBoxLockedHint : undefined}`
  - `aria-disabled={!canOpenBox}`
  - Disabled styling: append conditional classes, e.g. `${!canOpenBox ? "opacity-50 cursor-not-allowed hover:bg-[#FFEA9E]" : ""}` so the gold button visibly reads as locked and the hover brighten is suppressed.
- [ ] **6. (Optional) Visible caption.** Below the button, when `!canOpenBox`, render `<p className="text-xs text-white/40 text-center">{t.secretBoxLockedHint}</p>` for touch users who get no hover tooltip.
- [ ] **7. Verify build/lint.** `cd frontend && npm run lint` then `cd frontend && npm run build`. Resolve any TS errors (most likely a missing key in one locale).

## Edge cases to handle

- **Stats still loading:** Handled by existing `if (!stats)` spinner (lines 38–44) — button is not rendered yet, so no flash of enabled state.
- **Not authenticated:** Handled by existing `if (!isAuthed)` guard (lines 30–36).
- **`kudosReceived` undefined/null from API:** `?? 0` fallback keeps the box locked rather than crashing or accidentally enabling.
- **Exactly 5 kudos:** `>= 5` enables — boundary is inclusive per confirmed decision.
- **Touch devices (no hover):** `title` tooltip won't show; optional step 6 caption covers this.
- **i18n drift:** Forgetting the key in one locale breaks the shared translations type — add to both VN and EN in the same change.

## Risks & mitigations

- **Risk:** Disabled `<button>` still fires click via assistive tooling or programmatic dispatch. **Mitigation:** `disabled` attribute + `aria-disabled`; optionally early-return in `handleOpenGift`.
- **Risk:** Threshold becomes configurable later. **Mitigation:** Single `SECRET_BOX_THRESHOLD` constant — one-line change if it moves. Do not over-engineer config now (YAGNI).
- **Risk:** Future backend authority for the rule. **Mitigation:** Acceptable for now; frontend gate is non-authoritative UX only. Note in PR that the real entitlement check should live server-side when the open flow is implemented.

## Success criteria

- With `kudosReceived < 5`: button is visually disabled, non-clickable, shows the locked hint (tooltip and/or caption); no toast fires.
- With `kudosReceived >= 5`: button is fully enabled, original toast behavior unchanged.
- Both VN and EN render the correct hint text.
- `npm run lint` and `npm run build` in `frontend/` pass with no errors.
- No backend or migration changes introduced.

## How to verify

```bash
cd frontend && npm run lint
cd frontend && npm run build
```
Manual: log in, observe a user with <5 received kudos (disabled + hint) vs >=5 (enabled + toast). Toggle language to confirm both hint strings.

## Unresolved questions

- None blocking. Open product follow-up (out of scope): should the entitlement be enforced server-side when the actual "open box" flow is built?
