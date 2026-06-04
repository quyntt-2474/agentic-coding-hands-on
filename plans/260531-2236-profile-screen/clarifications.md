# Clarifications — Profile bản thân (My Profile) screen

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb
Frame: "Profile bản thân" (screen_id: 3FoIx6ALVb) — 28 specs, 0 test cases.

## Session 2026-05-31
- Q: Whose profile does this screen show? → A: The current logged-in user ("Profile bản thân"). Route `/profile/[email]`, self-view primary.
- Q: How should the kudos list (Section D) look + paginate? → A: Reuse the ALL KUDOS card UI (KudosPostCard) and the same Load More pagination logic.
- Q: How should the stats summary (Section B) look? → A: Reuse the KudosSidebar stats layout (SidebarStats): kudos received / sent / hearts received / box opened / box unopened + "Mở Secret Box" button.
- Q: Icon collection "Bộ sưu tập icon của tôi" (Section A, B2–B7)? → A: Hardcode as empty (gray placeholder icons). UI only, NO logic this iteration.
- Q: Secret Box opened/unopened counts (B.4/B.5)? → A: No Secret Box backend exists; hardcode 0 (matches existing SidebarStats). "Mở Secret Box" button keeps existing toast behavior.
- Q: Filter dropdown (Section C.3 "Đã gửi (5)")? → A: Toggle between Đã gửi (Sent) and Đã nhận (Received), filters the kudos list. Count = total for selected filter.
- Q: Header/Footer (Section 3, 7.4)? → A: Reuse existing SiteHeader / SiteFooter.
- Q: Can any authenticated user view another user's profile via GET /kudos/profile/:email (review finding H2)? → A: Yes, accepted. Existing app already links every name to /profile/{email} (UserInfoBlock) and exposes stars everywhere + received/sent via the public /kudos/recipient/:email/profile endpoint; restricting to self would break those links. Net-new exposure (heartsReceived) is acceptable for an internal tool.
