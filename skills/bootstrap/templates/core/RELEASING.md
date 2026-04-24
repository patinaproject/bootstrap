# Releasing

Releases are driven by [release-please](https://github.com/googleapis/release-please) and Conventional Commits. No manual version bumps, no local release commands.

## How it works

1. On every push to `main`, the `Release` workflow runs `release-please`. The same workflow can also be triggered manually from **Actions → Release → Run workflow** as an escape hatch — use it to seed the very first release PR before any push to `main`, or to re-run after a transient failure.
2. `release-please` scans Conventional Commits since the last tag.
3. It opens (or updates) a standing **"chore: release X.Y.Z"** PR that:
   - Bumps `package.json` version.
   - Syncs `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` to the new version (configured in `release-please-config.json`).
   - Appends generated entries to `CHANGELOG.md`.
4. **Clicking Merge on that PR** is the release action. It tags `vX.Y.Z` and publishes a GitHub Release with notes generated from the same commits.

## Prerequisites (one-time settings)

### Workflow permissions: read and write

`release-please` writes to the repo — it creates tags, publishes GitHub Releases via `POST /repos/.../releases`, relabels the release PR (`autorelease: pending` → `autorelease: tagged`), and comments on issues referenced in the changelog. The full canonical [permissions set from the release-please-action README](https://github.com/googleapis/release-please-action#workflow-permissions) is three scopes:

```yaml
permissions:
  contents: write
  issues: write
  pull-requests: write
```

`issues: write` is easy to miss — PR labels live on the Issues API, so relabeling the release PR needs it even though the target is a PR. Omitting any of the three causes `release-please-action` to fail with `Resource not accessible by integration` on the release step, regardless of how `contents: write` is declared elsewhere. The repo-level default of `read` additionally caps the workflow-level declarations, so both the repo toggle and the workflow YAML must agree.

Enable the read + write default:

- **Settings → Actions → General → Workflow permissions → Read and write permissions** (save).

Verify from the CLI:

```bash
gh api repos/<owner>/<repo>/actions/permissions/workflow \
  --jq .default_workflow_permissions
```

Expected output: `write`. If it prints `read`, the toggle did not stick (see "Recognizing an org-policy cap" below).

### Allow Actions to create and approve pull requests

`release-please` opens its standing release PR using `secrets.GITHUB_TOKEN`. This requires:

- **Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests**.

Without it, the workflow fails with `GitHub Actions is not permitted to create or approve pull requests.`

### Recognizing an org-policy cap

If either of the two checkboxes above is greyed out, or if the `gh api` verification above still returns `read` after you saved the UI toggle, the setting is being overridden by an organization-level policy. Org-level `Settings → Actions → General → Workflow permissions` takes precedence over repo-level defaults: when the org policy caps repo defaults at `read`, no repo-level change will take effect. Escalate to an org admin, or fall back to a PAT/App token (next section).

### PAT / GitHub App token fallback

Use this path when org policy caps repo-level workflow permissions below read + write, and raising the org policy is not possible.

Required token scopes:

- `contents: write` — to create tags and publish releases.
- `issues: write` — to relabel the release PR (PR labels are on the Issues API) and to comment on issues referenced in the changelog.
- `pull-requests: write` — to open and update the standing release PR.

A fine-grained PAT or a GitHub App installation token both work. Store it as an **org-level secret** (preferred, so every plugin repo inherits it) or a **repo-level secret**. Suggested name: `RELEASE_PLEASE_TOKEN`.

Wire it into `.github/workflows/release.yml` by replacing the `token:` input on the `release-please-action` step:

```yaml
# Before (default path, works when repo/org allows read + write):
          token: ${{ secrets.GITHUB_TOKEN }}
# After (fallback when org policy caps the default):
          token: ${{ secrets.RELEASE_PLEASE_TOKEN }}
```

The default code path stays `secrets.GITHUB_TOKEN` in the emitted template so forks outside Patina don't need to provision a Patina-specific secret.

### Tag ruleset caution

`release-please-action` creates **unsigned** tags. It has no signing path. If a repository or organization adds a tag-scoped ruleset that requires signatures on release tags, the release step will fail the moment release-please tries to push `vX.Y.Z`.

If signature enforcement is desired:

- Scope the signature rule to **branches only** (most common).
- Or scope to specific **non-release tag refs** (e.g. a pattern that excludes `v*`).

Verify no release-tag-scoped signature rule is in place:

```bash
gh api repos/<owner>/<repo>/rulesets \
  --jq '.[] | select(.target=="tag")'
```

### Branch-ruleset bypass for the GitHub Actions app

Even with all three `GITHUB_TOKEN` scopes granted and `default_workflow_permissions` set to `write`, `POST /repos/<owner>/<repo>/releases` returns `Resource not accessible by integration` when **the `target_commitish` points at a commit on a branch covered by a protective ruleset** and the `github-actions[bot]` app is not in that ruleset's `bypass_actors`. Release-please always targets the release-PR merge commit — which is on your default branch — so any default-branch ruleset (for example, one with `required_signatures`, `pull_request`, or `non_fast_forward`) will block release creation from the built-in token.

This is easy to miss because the 403's docs URL points at the `create-a-release` endpoint, making it look like a permission-scope bug rather than a ruleset denial. It also only reproduces on the *first* release of a repo whose default branch already has an active ruleset.

There are two pure-repo-config paths forward:

1. **Add the GitHub Actions app to `bypass_actors`** on every ruleset that covers the default branch. In the ruleset UI: **Bypass list → Add bypass → Apps → GitHub Actions**, bypass mode `Always`. Via the REST API the payload is:

   ```json
   {
     "bypass_actors": [
       { "actor_id": 15368, "actor_type": "Integration", "bypass_mode": "always" }
     ]
   }
   ```

   `15368` is the global app ID for `github-actions` (same across all GitHub). Once added, release-please can target default-branch commits without triggering the ruleset.

2. **Narrow the ruleset scope.** If you don't want the bot bypassing every rule, split the ruleset: keep `pull_request` / `non_fast_forward` rules on the default branch, and move rules that interact with release creation (notably `required_signatures`) to a separate ruleset that excludes the release-PR merge-commit pattern. This is more effort but preserves the full rule surface for human changes.

Path 1 is what most OSS community members will do and is the recommendation. Path 2 is for orgs with stricter security postures.

Verify the GitHub Actions app has bypass on every default-branch ruleset:

```bash
gh api "repos/<owner>/<repo>/rulesets?includes_parents=true" \
  --jq '.[] | select(.target=="branch" and (.conditions.ref_name.include | index("~DEFAULT_BRANCH"))) | {id, name, bypass_actors}'
```

Each ruleset should list an `Integration` bypass with `actor_id: 15368`. If any lacks it, add it via the UI or a `PATCH` to `repos/<owner>/<repo>/rulesets/<id>`.

### Require SHA-pinned actions

Also recommended (defense-in-depth, aligns with the SHA-pin convention in [`AGENTS.md`](AGENTS.md)):

- **Settings → Actions → General → Require actions to be pinned to a full-length commit SHA** (available at repo or org level).

When enabled, GitHub refuses to run workflows that `uses:` an action by tag or branch.

## Semver decision

Determined from commit types — no human choice:

- `fix:` → patch
- `feat:` → minor
- `feat!:` or `BREAKING CHANGE:` footer → major

## Keeping versions aligned between releases

`package.json` is the canonical source. `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` are kept in lockstep.

- `scripts/check-plugin-versions.mjs` is run by the husky `pre-commit` hook and by CI, blocking drift.
- `scripts/sync-plugin-versions.mjs` force-rewrites the plugin manifests from `package.json` if needed.

`CHANGELOG.md` is owned by release-please. Do not hand-edit released sections.

`CHANGELOG.md` is excluded from `pnpm lint:md` (see the `#CHANGELOG.md` glob in `package.json`). release-please emits double blank lines between sections, which violates `MD012/no-multiple-blanks`, and its generator has no knob to change that. Fighting the generator is not worth the churn — the released sections are machine-written and not meant to be hand-edited, so linting them adds no value.

## Distribution via `patinaproject/skills`

When a release is published **and the repository owner is `patinaproject`**, the release workflow automatically dispatches `bump-plugin-tags.yml` on `patinaproject/skills`. That marketplace repo opens (or updates) a PR bumping this plugin's pinned `ref` across every Patina marketplace manifest.

No per-repo opt-in is required — the `github.repository_owner == 'patinaproject'` check in the workflow gates this behavior. Forks in other orgs skip the step automatically.

Prerequisite (org-level, one-time):

- Org secret on `patinaproject`: `PATINA_SKILLS_DISPATCH_TOKEN` — a fine-grained PAT (or GitHub App installation token) with `actions: write` on `patinaproject/skills`. Available to every plugin repo in the org.

If the token is missing, the dispatch step fails but the release itself still completes (the notify step runs in a separate job). Marketplace bumps can also be kicked off manually from `patinaproject/skills`' Actions tab.

## Writing commits for a clean changelog

- Use Conventional Commits: `feat: #<issue> …`, `fix: #<issue> …`, etc.
- Breaking changes: prefix the type with `!` (e.g. `feat!: #123 rename foo to bar`) **and** include a `BREAKING CHANGE: …` footer in the PR body.
- Squash-merge flow: PR titles must themselves be conventional-commit-shaped so the squash commit lands with the correct type/scope. Enforced by the `Lint PR` workflow.
