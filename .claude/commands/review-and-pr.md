---
description: Review unstaged changes for danger/policy violations, commit the safe set, then open a PR to a required base branch
argument-hint: <base-branch> (required)
---

Run this entire flow yourself in the main thread (you can pause and ask the user at each gate via `AskUserQuestion`). NEVER delegate the approval gates to a subagent — subagents cannot prompt the user.

<base-branch>$ARGUMENTS</base-branch>

**Hard rules**
- The PR target repository is ALWAYS `origin` (the user's fork). Pass `--repo` explicitly to `gh` so a fork does not open the PR against `upstream`.
- Conventional commits only. Format: `[PROJ-#<IssueNum>]<type>(<scope>): <short description>` (e.g. `[PROJ-#2]feat(kudos): implement countdown screen`). Note: no space between `]` and `<type>`; `(<scope>)` is included when a clear scope exists. Types: feat/fix/refactor/docs/test/chore/perf.
- NO AI references anywhere — not in commit messages, not in the PR body, not in the title. (Project rule overrides any default co-author footer.)
- NEVER commit, push, or force-add a dangerous file. NEVER force-push. NEVER push to the base branch.
- Stop and report instead of guessing whenever a gate cannot be satisfied.

---

## Step 0 — Resolve base branch (REQUIRED, blocking)

1. Read the base branch from `<base-branch>`. If empty/whitespace:
   - Run `git branch --format='%(refname:short)'` and list local branches.
   - Use `AskUserQuestion` to ask the user which branch is the base (offer `main`, `develop`, and other candidates). DO NOT proceed without an answer.
2. Capture the compare branch: `git rev-parse --abbrev-ref HEAD`.
3. Validate:
   - Base must exist: `git rev-parse --verify <base>` (try `git rev-parse --verify origin/<base>`, `git fetch origin <base>` if missing).
   - Compare branch MUST differ from base. If equal → STOP: tell the user to switch to a feature branch first.
4. Echo the resolved pair: `compare = <current>`, `base = <base>`, `repo = origin`.

## Step 1 — Audit unstaged & untracked changes

1. Gather state:
   - `git status --porcelain=v1`
   - `git diff --stat` and `git diff --stat --cached`
   - Untracked: `git ls-files --others --exclude-standard`
2. Classify every changed/untracked file as **SAFE** or **DANGEROUS/INAPPROPRIATE**.

   **Dangerous — block by default** (check filename AND, where cheap, diff content):
   - Secrets/credentials: `.env`, `.env.*` (allow `.env.example`/`.env.sample`/`.env.template`), `*.pem`, `*.key`, `id_rsa*`, `*.p12`, `*.pfx`, `*.keystore`, anything matching `secret|credential|password|token` in the path.
   - Secret-looking content in the diff: API keys, bearer tokens, `AWS_SECRET`, private-key headers (`-----BEGIN ... PRIVATE KEY-----`), long base64 blobs, connection strings with embedded passwords.
   - Build artifacts / deps: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `*.log`.
   - Stray binaries/screenshots not meant for the repo: root-level images / temp captures (e.g. `kudos-current.png`, `widget-closed.png`), files > ~5 MB.
   - Files already ignored by `.gitignore` (`git check-ignore <file>` returns non-empty) that are being force-added.

   **Inappropriate — warn (not auto-blocked):** leftover `console.log`/`debugger`/`print` debug code, large commented-out blocks, changes unrelated to the branch's purpose, TODO/FIXME introduced.

3. Produce a short table: file → category → reason. Keep it concise.

## Step 2 — Alert & ask (only if anything flagged)

If any dangerous OR inappropriate file is found, present them grouped (🔴 Blocking secrets/artifacts first, then ⚠️ warnings) and ask via `AskUserQuestion`:
- "Dangerous/inappropriate files detected. Exclude them from the commit?"
  - **Yes, exclude them (Recommended)** — keep them out of staging.
  - **Decide per file** — then ask which to keep/exclude.
  - **No, include everything** — only if user explicitly insists; re-confirm secrets are intentional.

For excluded files:
- If already staged: `git restore --staged <file>` (or `git reset HEAD <file>`).
- Leave them in the working tree, uncommitted.
- For ignorable artifacts/secrets, offer to append the path(s) to `.gitignore`.

If nothing is flagged, say so and continue.

## Step 3 — Stage & commit the safe set

1. Stage ONLY the approved safe files explicitly (`git add <file> ...`) — never `git add -A` blindly when exclusions exist.
2. Build the commit message:
   - Detect `<IssueNum>` from the branch name (e.g. `feature/PROJ-2-...` → `2`) or ask the user if not derivable.
   - Detect `<type>`, `<scope>`, and `<short description>` from the staged changes (scope = the main module/dir touched, e.g. `kudos`, `auth`).
   - Format: `[PROJ-#<IssueNum>]<type>(<scope>): <short description>` (e.g. `[PROJ-#2]feat(kudos): add create-kudos dto validation`). No space between `]` and `<type>`. Omit `(<scope>)` only if no single clear scope. No AI references.
3. `git commit -m "<message>"`. Report the resulting commit hash.

## Step 4 — Re-check committed files → user approval gate

1. Show what was committed: `git show --stat HEAD` and the final message; also `git diff <base>...HEAD --stat` for the full PR scope.
2. Ask via `AskUserQuestion`: "Approve these committed changes?"
   - **Approve (Recommended)** → continue.
   - **Amend message / files** → fix (`git commit --amend` or stage/unstage), then re-show and re-ask.
   - **Abort** → stop; leave the commit in place and tell the user (do not reset their work).

## Step 5 — Confirm branches before PR

1. Restate: `compare = <current>` → `base = <base>`, target repo = `origin` (fork).
2. Ensure the compare branch is on origin: `git push -u origin <compare>` (NEVER push to base; NEVER force-push).
3. Ask via `AskUserQuestion`: "Create PR `<compare>` → `<base>` on origin?"
   - **Confirm (Recommended)** → continue.
   - **Change base** → re-resolve base (Step 0) and re-confirm.
   - **Cancel** → stop.

## Step 6 — Create the PR

1. Read `.github/pull_request_template.md` (Vietnamese template).
2. Fill every section from the actual changes (`git log <base>..<compare>`, `git diff <base>...<compare> --stat`):
   - **Đặc tả**: spec/issue link — derive from branch/issue or ask the user; leave a clear placeholder if none.
   - **Tóm tắt Triển khai**: what was implemented.
   - **Bao phủ Spec**: tick only what is genuinely covered; leave others unchecked.
   - **Thay đổi**: bullet the concrete changes.
   - **Testing**: real status — do not invent pass counts or coverage.
   - **Sai lệch so với Spec**: note deviations or "Không có".
3. Derive a conventional PR title from the commits (no AI references).
4. Write the body to a temp file outside the repo: `BODY=$(mktemp)` then write the filled template into it.
5. Create the PR within the fork and assign the author to themselves:
   ```bash
   gh pr create \
     --repo quyntt-2474/agentic-coding-hands-on \
     --base "<base>" \
     --head "<compare>" \
     --title "<title>" \
     --body-file "$BODY" \
     --assignee @me
   ```
   (`--repo` keeps the PR inside origin instead of defaulting to upstream; `--assignee @me` = the author.)
6. `rm -f "$BODY"`. Report the PR URL.

---

**Final report:** compare→base, target repo, commit hash(es), files excluded (and why), and the PR URL.
