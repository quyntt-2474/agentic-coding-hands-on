# Clarifications

## Session 2026-05-25

- Q: Database/ORM → A: TypeORM + PostgreSQL
- Q: Scope → A: Live board page (/kudos) + kudos detail dialog (/kudos/[id]); submission dialog and secret box dialog are OUT of scope
- Q: /kudos/[id] detail view — new page or dialog? → A: Dialog/modal overlay on /kudos — NOT a new page. Implemented via Next.js App Router intercepting routes (@modal parallel route)
- Q: Spotlight rendering → A: Real word cloud library (d3-cloud with custom React SVG renderer)
- Q: Real-time updates → A: Polling every 15s (no WebSocket)
- Q: Special day (+2 hearts) → A: Out of scope (future admin feature)
- Q: Secret Box gift mechanism → A: Sidebar D.3 ("10 SUNNER NHẬN QUÀ MỚI NHẤT") rendered as 10 most recent kudos receivers (proxy); D.1 stats for secret boxes shown as static 0 until feature built
- Q: User department data → A: Stored when user first creates/receives kudos; sourced from JWT payload or empty string if not present in Google profile
- Q: Kudos submission (A.1 input) → A: Clicking opens a toast/alert "Chức năng đang phát triển" for now (dialog is out of scope)
- Q: Image attachments in kudos cards → A: Display placeholder/empty when no images (feature not in scope for this plan)
- Q: Profile page navigation → A: Link to /profile/[email] (page not yet built — link navigates but no page exists yet; acceptable for this plan)
