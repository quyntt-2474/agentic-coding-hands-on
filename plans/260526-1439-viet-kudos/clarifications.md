# Clarifications — Viết Kudo Screen

## Session 2026-05-26

- Q: Image upload approach → A: Implement via AWS S3 (backend upload/download through S3)
- Q: Anonymous sending → A: Implement fully — add isAnonymous (boolean) + senderAlias (string?) to DTO and DB
- Q: Rich text format → A: Use Tiptap library (HTML stored in DB)
- Q: Hashtag source → A: Select from predefined list only (GET /hashtags dropdown, no free-form input)

## MoMorph refs
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
