# Code Review — Viết Kudo (Write Kudos) Feature
**Date:** 2026-05-26
**Reviewer:** reviewer agent

---

## Scope
- Backend: 13 files (S3 service/module, users service/controller/module, kudos entity, DTOs, service, controller, module, app.module, migration)
- Frontend: 8 files (write-kudos-modal, rich-text-toolbar, recipient-search, hashtag-selector, image-upload-preview, kudos-input-trigger, types/kudos, i18n)
- LOC: ~950 backend / ~700 frontend

---

## Overall Assessment

Feature is mostly well-structured. The two-step upload flow (upload image → get key → submit kudos) is clean. Anonymous masking logic in `toCard` is correct for the core case. Most critical path code is solid. However there are five issues worth fixing before production traffic, ranging from a data-integrity race to a missing backend array-size constraint that could be weaponized.

---

## Critical Issues

### 1. S3 Image Key Ownership Not Validated — IDOR / Data Exfiltration
**Severity: critical**
**File:** `kudos.service.ts` lines 279–287, `kudos.controller.ts` POST /kudos

`create()` saves whatever `imageKeys` strings the authenticated user supplies without checking that those keys were actually uploaded by that user. The backend then generates presigned GET URLs for those keys on every `findAll`/`findOne` call. An attacker who knows (or guesses) S3 key patterns from another user's upload can:
1. Submit a kudos with `imageKeys: ["kudos-images/<uuid-from-someone-else>.jpg"]`
2. Every viewer of that kudos gets a live presigned URL for the victim's file

Since keys are `kudos-images/{randomUUID}.{ext}`, guessing is hard but not impossible if UUIDs leak via other API responses or logs. The real risk is that an attacker who uploads one image can observe their own key format and try to enumerate keys for images they didn't upload.

**Fix:** Store a mapping of `(uploaderEmail → key)` server-side (e.g. a short-lived Redis set or a `KudosImageUpload` table), and validate each submitted key against the uploader's email before saving.

---

### 2. No `ArrayMaxSize` on `imageKeys` in DTO — DoS / N+1 Amplification
**Severity: critical**
**File:** `backend/src/kudos/dto/create-kudos.dto.ts` line 36–39

`imageKeys?: string[]` has `@IsArray()` and `@IsString({ each: true })` but no `@ArrayMaxSize(5)`. An authenticated user can submit 500+ fake keys in one POST. `toCard()` then calls `getPresignedUrl()` for each key via `Promise.all`, generating up to 500 concurrent signed-URL requests to AWS on every subsequent `findAll` that touches that kudos. Under normal page load with 20 kudos, each with 500 keys, this is 10,000 AWS API calls per page request.

**Fix:** Add `@ArrayMaxSize(5)` and `@MaxLength(200, { each: true })` to `imageKeys` in `CreateKudosDto`.

---

## High Priority

### 3. `simple-array` Column — Comma Injection in `imageKeys`
**Severity: high**
**File:** `kudos.entity.ts` line 48, `create-kudos.dto.ts` line 36

TypeORM's `simple-array` stores arrays as a comma-separated string. If an S3 key ever contains a comma, it will be split incorrectly on read. The current upload key format (`kudos-images/{uuid}.{ext}`) never produces commas, but:
- There is no `@Matches(/^[^,]+$/, { each: true })` validator on incoming `imageKeys` strings
- An attacker can send `imageKeys: ["kudos-images/real-uuid.jpg,kudos-images/injected.jpg"]` and smuggle an extra key past the array-size check (if it were added)

**Fix:** Either switch `imageKeys` to `jsonb` column type (and update migration), or add a `@Matches(/^[a-zA-Z0-9\-_./]+$/, { each: true })` constraint to `imageKeys` in the DTO.

### 4. Hashtag Find-or-Create Race Condition
**Severity: high**
**File:** `kudos.service.ts` lines 290–294

Inside the transaction, for each hashtag name:
```ts
let tag = await em.findOne(Hashtag, { where: { name } });
if (!tag) tag = await em.save(Hashtag, { name });
```
Two concurrent `POST /kudos` requests with the same new hashtag name will both pass the `findOne` check and both call `em.save`, producing a duplicate `Hashtag` row if there's no unique constraint on `name`. Depending on DB isolation level, the transaction won't catch this.

**Fix:** Replace with `em.upsert(Hashtag, { name }, ['name'])` (same pattern already used for `User` upsert above it), and ensure `hashtag.name` has a `UNIQUE` constraint in the schema.

### 5. Image Upload Index-Based State Mutation — Race Condition
**Severity: high**
**File:** `frontend/components/kudos/image-upload-preview.tsx` lines 71–103

`startIndex` is captured at the time `handleFiles` runs. Each concurrent upload callback updates `prev[entryIndex]` by absolute index. If the user removes an image (which calls `prev.filter(...)`) while another upload is in flight, the array shifts and `entryIndex` points to the wrong entry. The upload result then overwrites a different image's state.

```
User adds images [A, B, C] → startIndex=0, entryIndex 0,1,2
User removes A at index 0 → array becomes [B, C]
Upload of C completes at entryIndex=2 → prev[2] is undefined → spread of undefined
```

**Fix:** Instead of index-based lookup, use a stable `id` (e.g. the blob URL itself) as identifier and match on that inside the functional updater:
```ts
onChange((prev) =>
  prev.map((img) =>
    img.previewUrl === blobUrl ? { ...img, remoteKey: key, ... } : img
  )
);
```

---

## Medium Priority

### 6. `message` MaxLength Validates HTML, Not Text — Bypass
**Severity: medium**
**File:** `create-kudos.dto.ts` line 16, `write-kudos-modal.tsx` line 113

`@MaxLength(5000)` validates the raw HTML string (e.g. `<p><strong>x</strong></p>`). A message with 500 characters of text can easily produce 2000+ characters of HTML with heavy formatting. Conversely, a message with 5000 characters of tags and 1 character of actual text passes validation. The frontend validates `editor.getText().trim()` for emptiness but sends `editor.getHTML()` — the two lengths differ.

**Fix:** Either validate on text length server-side (strip HTML before measuring), or align the limit to apply to HTML (raise to ~20,000 to accommodate reasonable formatting overhead and document the rationale).

### 7. `GET /users` Has No Authentication — User Email Enumeration
**Severity: medium**
**File:** `users.controller.ts`, `users.service.ts`

`GET /users?search=q` returns `email`, `name`, `picture`, `department` for matching users with no auth guard. The design spec says "no auth required" for this endpoint, but this allows unauthenticated actors to enumerate all employee emails/departments by iterating through alphabet queries. The `ILIKE %term%` search means a single letter `?search=a` returns up to 10 matches.

**Fix:** Add `@UseGuards(JwtAuthGuard)` to `UsersController`. Since this endpoint is only called from the write-kudos modal (which requires being logged in to use), the UX impact is zero. The frontend already sends the auth token.

### 8. `getStats` `recentRecipients` Returns Global Data, Not User-Scoped
**Severity: medium**
**File:** `kudos.service.ts` lines 234–244

The `recentRecipients` query fetches the 10 most recently created kudos globally (no `WHERE senderEmail = :email` or `receiverEmail = :email` filter) and exposes all receivers' `email` + `picture`. Since `/kudos/stats` is auth-guarded and scoped to a user, callers likely expect their own recent recipients; returning global data is both incorrect behavior and a minor data leak of who received kudos recently.

**Fix:** Add `.where('k.senderEmail = :email', { email: userEmail })` to the `recentRecipients` query.

### 9. `ext` Extraction Bug for Files Without Extension
**Severity: medium**
**File:** `s3.service.ts` line 30

```ts
const ext = file.originalname.split('.').pop() ?? 'bin';
```
For `originalname = 'nodotfile'`, `split('.').pop()` returns `'nodotfile'` (the whole string), not `undefined`, so the `?? 'bin'` fallback never fires. The S3 key becomes `kudos-images/{uuid}.nodotfile`. While harmless for the current upload flow (MIME check runs first), an attacker crafting a raw multipart request could produce odd keys. More importantly for a file like `'test.'`, `pop()` returns `''` and the key ends in a dot.

**Fix:**
```ts
const rawExt = file.originalname.includes('.')
  ? (file.originalname.split('.').pop() ?? '')
  : '';
const ext = /^[a-z0-9]{1,10}$/i.test(rawExt) ? rawExt : 'bin';
```

### 10. `window.prompt()` for Link URL — UX / Minor XSS Surface
**Severity: medium (XSS low, UX high)**
**File:** `write-kudos-modal.tsx` lines 131–135

`window.prompt()` is used to collect a URL for the Tiptap Link extension. This is blocked in many environments (browser popups disabled, testing frameworks). Tiptap v3's `setLink` does call `isAllowedUri` which blocks `javascript:` protocol, so XSS risk is mitigated by the library. However, the prompt is still a poor UX pattern and will silently fail in sandboxed iframes.

**Fix:** Replace with an inline popover input inside the editor toolbar. This is a standard Tiptap pattern.

---

## Low Priority

### 11. Live Re-Validation Effect Missing `editor` Content Dependency
**Severity: low**
**File:** `write-kudos-modal.tsx` lines 93–97

The live re-validation `useEffect` tracks `[recipient, hashtags, submitted]` but not the Tiptap editor content. After first submission attempt, editing the message text will not clear the content error until the user also changes recipient or hashtags. The ESLint disable comment acknowledges this.

**Fix:** Tiptap exposes an `onUpdate` callback. Store editor HTML in state and add it to the dependency array, or subscribe via `editor.on('update', ...)`.

### 12. `senderAlias` Always Returned in Response, Even When Non-Anonymous
**Severity: low**
**File:** `kudos-card.dto.ts` line 20, `kudos.service.ts` line 80

`senderAlias` is included in every `KudosCardDto` (it's `null` when non-anonymous). This is correct but slightly leaks schema — clients know the alias field exists. Not a real issue, but could be omitted from the response type when `isAnonymous: false` to reduce response size.

### 13. Frontend `KudosCard` Type Missing `isAnonymous` and `imageUrls` Fields
**Severity: low (TypeScript, not runtime)**
**File:** `frontend/lib/types/kudos.ts` lines 9–19

`KudosCard` does not include `isAnonymous: boolean`, `senderAlias?: string`, or `imageUrls: string[]` that the backend now returns. Components like `kudos-post-card.tsx` and `kudos-detail-modal.tsx` use `KudosCard` but can't render images or handle anonymous display without these fields being in the type. Currently TypeScript won't error (the runtime values exist on the object) but any attempt to access `kudos.imageUrls` or `kudos.isAnonymous` in those components will be a TS error.

**Fix:** Add these fields to `KudosCard`:
```ts
isAnonymous: boolean;
senderAlias: string | null;
imageUrls: string[];
```

### 14. `POST /kudos` Route Registration Order
**Severity: low (informational)**
**File:** `kudos.controller.ts`

`@Post()` (line 76) is registered before `@Post('images')` (line 86). In NestJS/Express, static routes like `'images'` take priority over the wildcard-less `''` POST route, so there is no actual conflict. This is fine. Noting it was checked.

### 15. No Rate Limiting on `POST /kudos/images`
**Severity: low**
**File:** `kudos.controller.ts` lines 85–103

There is no `@Throttle()` guard on the image upload endpoint. An authenticated user can spam uploads to fill the S3 bucket. Since images are never cleaned up (no orphan-key GC), uploaded-but-never-submitted images accumulate indefinitely.

**Fix (short-term):** Add `@Throttle({ default: { limit: 20, ttl: 60000 } })`. Long-term, implement a TTL-based cleanup job for keys not referenced in any kudos row.

---

## Edge Cases Found

- **Recipient not found at submit time:** `create()` auto-creates a stub `User` record (`firstName = email.split('@')[0]`, `lastName = ''`) if the receiver doesn't exist. This means typo'd emails silently create ghost users. Consider validating the receiver email against existing users before creating the kudos.
- **Invalid S3 key in `imageKeys`:** `getPresignedUrl()` will succeed even for non-existent S3 keys (the signed URL is generated regardless; it returns 403/404 when the browser actually requests it). No error propagates to the caller. This is acceptable behavior but images will silently fail to load on the frontend.
- **Anonymous sender can still like their own kudos:** Frontend shows `isOwn = sender.email === currentUserEmail`. When `isAnonymous=true`, `sender.email` is `''`, so `isOwn` is always false for anonymous kudos. An anonymous sender can therefore like their own kudos from the frontend. The backend `like()` correctly checks `kudos.senderEmail` (real email) against `userEmail` and throws `ForbiddenException`, so this is blocked server-side. Frontend just shows the button incorrectly.

---

## Positive Observations

- Anonymous masking in `toCard` is thorough: `name`, `email`, and `picture` are all cleared.
- The two-step upload flow (upload → key → submit) correctly avoids storing images for failed submissions.
- `ValidationPipe({ whitelist: true, transform: true })` is enabled globally — unknown fields are stripped.
- Image upload uses `memoryStorage` (no temp disk files) and validates MIME type via `fileFilter`.
- Tiptap v3's `isAllowedUri` blocks `javascript:` URLs in links — XSS risk mitigated by library.
- `like()` checks `senderEmail` from the DB record, not the masked DTO — prevents self-like bypass.
- Frontend correctly uses functional state updaters to avoid stale closure bugs in most cases.
- Blob URLs are revoked in `removeImage` — no memory leak for removed previews.
- Editor `destroy()` called on unmount via `useEffect` cleanup.
- CORS is scoped to `FRONTEND_URL` env var, not `*`.

---

## Recommended Actions (Priority Order)

1. **[critical]** Add `@ArrayMaxSize(5)` + `@MaxLength(200, { each: true })` to `imageKeys` in `CreateKudosDto` immediately.
2. **[critical]** Implement S3 key ownership validation — store uploader email with each key, verify on submit.
3. **[high]** Fix `simple-array` comma injection: add `@Matches(/^[a-zA-Z0-9\-_.\/]+$/, { each: true })` to `imageKeys`, or migrate column to `jsonb`.
4. **[high]** Replace hashtag find-or-create with `upsert` + unique DB constraint on `hashtag.name`.
5. **[high]** Fix image upload race condition: switch from index-based to `previewUrl`-based functional updater.
6. **[medium]** Add `@UseGuards(JwtAuthGuard)` to `GET /users`.
7. **[medium]** Fix `getStats` `recentRecipients` to filter by `senderEmail = userEmail`.
8. **[medium]** Fix `ext` extraction in `s3.service.ts` — sanitize to alphanumeric-only.
9. **[low]** Update `KudosCard` frontend type to include `isAnonymous`, `senderAlias`, `imageUrls`.
10. **[low]** Replace `window.prompt()` for link input with an inline popover.

---

## Metrics
- Type Coverage: Mostly good; one gap in `KudosCard` frontend type (items 13)
- Linting Issues: 1 ESLint disable comment acknowledged (item 11)
- Validation Gaps: 2 (no `ArrayMaxSize` on imageKeys, no `@Matches` pattern constraint)

## Unresolved Questions
- Is there a planned cleanup job for orphaned S3 keys (images uploaded but kudos never submitted)?
- Is `GET /users` intentionally public (design decision) or an oversight? The PLAN.md note says "no auth required" — if intentional, at minimum add pagination and a minimum query length requirement (`q.length >= 2`) to limit enumeration.
- Should the `recentRecipients` field in `/kudos/stats` show the current user's own sent recipients, or is global "recent" the intended behavior?
