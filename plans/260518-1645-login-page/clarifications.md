## Session 2026-05-18

- Q: Google OAuth setup for local dev → A: Real Google OAuth with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Q: Auth token strategy → A: JWT in response body; backend returns JWT after OAuth callback; frontend stores in localStorage
- Q: Post-login redirect → A: Redirect to / (homepage) after successful login
- Q: Languages supported → A: VN (default) + EN; language selector toggles UI text
