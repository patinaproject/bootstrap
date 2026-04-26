# Design: Run release-please on every PR merge instead of manual dispatch [#42](https://github.com/patinaproject/bootstrap/issues/42)

## Context

The `Release` workflow is currently triggered by `workflow_dispatch` plus `pull_request: closed` filtered to PRs carrying `autorelease: pending`. Cutting any release therefore requires a maintainer to manually dispatch the workflow at least once to refresh the standing release PR. release-please is idempotent — it updates an existing standing PR or opens one if absent — so the manual step adds friction with no offsetting safety benefit.

This design reverses the explicit choice in [#31](https://github.com/patinaproject/bootstrap/issues/31) (commit d6a370b), which removed `push` triggering to suppress noisy `Release` runs against unrelated merges. The trade-off is being re-evaluated: noise from idempotent no-op runs is acceptable; missed refreshes (because someone forgot to dispatch) are not.

## Decision

Replace the `workflow_dispatch` trigger with `push` on `main`. Keep the `pull_request: closed` + `autorelease: pending` branch that auto-cuts the tag when the standing release PR is merged.

`on:` block:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]
```

Job `if:`:

```yaml
if: |
  github.event_name == 'push' ||
  (github.event.pull_request.merged == true &&
   contains(github.event.pull_request.labels.*.name, 'autorelease: pending'))
```

This applies to the root mirror `.github/workflows/release.yml` and to the two templates under `skills/bootstrap/templates/{agent-plugin,patinaproject-supplement}/.github/workflows/release.yml`.

`RELEASING.md` (root + both template variants) must be rewritten to drop the manual-dispatch ritual and describe the new auto-refresh + auto-tag flow.

The `notify-patinaproject-skills` job (patinaproject-supplement template + root mirror) is unchanged — it still gates on `release_created == 'true'` and `github.repository_owner == 'patinaproject'`.

## Requirements

- R1: `Release` workflow auto-runs on every push to `main` and refreshes the standing release PR.
- R2: `Release` workflow continues to auto-cut the tag and (on `patinaproject` repos) dispatch the marketplace bump when the standing release PR is squash-merged.
- R3: `workflow_dispatch` is removed from all three release workflow surfaces (root + two templates).
- R4: `RELEASING.md` (root + both template variants) describes the new flow with no manual-dispatch instructions.
- R5: Baseline round-trip preserved — templates are edited first, root mirrors match templates exactly except for repo-specific differences already encoded in the supplement variant.

## Acceptance criteria

- AC-42-1: Given a regular feature/fix PR is squash-merged into `main`, when the resulting `push` event fires, then `Release` runs and `release-please` opens or refreshes the standing release PR with no manual intervention.
- AC-42-2: Given the standing release PR is squash-merged, when the `pull_request: closed` event fires with `autorelease: pending` present, then `Release` runs, the tag is cut, the GitHub Release is published, and (on `patinaproject` repos) the marketplace bump is dispatched.
- AC-42-3: Given any of the three release workflow files is inspected, when the `on:` block is read, then it contains exactly `push` (branches: `main`) and `pull_request: closed` (branches: `main`), and contains no `workflow_dispatch` entry.
- AC-42-4: Given a maintainer reads `RELEASING.md` (root and both template variants), when they look for the release flow, then it describes a single-step auto-refresh plus automatic tag-cut-on-merge with no manual-dispatch instructions remaining.

## Non-goals

- Marketplace-bump path on `patinaproject/skills`.
- Label flow (`autorelease: pending` / `autorelease: tagged`).
- release-please commit-type/semver behavior.
- The `notify-patinaproject-skills` job structure or its App-token plumbing.

## Risks

- Increased number of `Release` workflow runs: every merge to `main` triggers a run, even when no releasable commits are present. Mitigated by release-please being fast and idempotent on no-op runs.
- The `Release` run that occurs as a side effect of merging the release PR fires *both* `push` and `pull_request: closed` events. The `pull_request: closed` branch is gated to require `autorelease: pending`; the `push` branch will also fire. release-please is idempotent across both, so the worst case is two no-op-or-equivalent runs against the same head. Acceptable.
