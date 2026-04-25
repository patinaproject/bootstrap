# Plan: Release workflow dispatches wrong filename on patinaproject/skills: bump-plugin-tags.yml vs plugin-release-bump.yml [#26](https://github.com/patinaproject/bootstrap/issues/26)

## Context

Implements the design at
[`docs/superpowers/specs/2026-04-25-26-release-workflow-dispatches-wrong-filename-design.md`](../specs/2026-04-25-26-release-workflow-dispatches-wrong-filename-design.md).
The Patina supplement of `release.yml` dispatches `bump-plugin-tags.yml` on
`patinaproject/skills`, but the workflow on that repo is
`plugin-release-bump.yml`. Pure rename through the templates-first loop, with
matching updates to current operator-facing docs that name the dispatched
filename.

## Workstreams

### 1. Rename the dispatched workflow (template + mirrored root)

Updates AC-26-1 in full and AC-26-2 partially (workflow side of the matched
pair).

- **Files**
  - `skills/bootstrap/templates/patinaproject-supplement/.github/workflows/release.yml`
    (line 54: `workflow: bump-plugin-tags.yml` → `plugin-release-bump.yml`).
  - `.github/workflows/release.yml` (line 54: same edit; mirrored root).
- **Edit detail** — Change only the `workflow:` input value on the
  `benc-uk/workflow-dispatch` step. Do not touch `inputs:`, `token:`, the job
  `if:` gate, or any pinned action SHA.
- **Order** — Edit the template first, then mirror to the root in the same
  commit so the templates-first loop is visible in the diff.
- **Verification**
  - `rg -n 'bump-plugin-tags\.yml' skills/bootstrap/templates/patinaproject-supplement/.github/workflows/release.yml .github/workflows/release.yml`
    returns no matches.
  - `rg -n 'plugin-release-bump\.yml' skills/bootstrap/templates/patinaproject-supplement/.github/workflows/release.yml .github/workflows/release.yml`
    returns one hit per file, both on the `workflow:` input line.
  - `actionlint` (CI on `.github/workflows/**`) passes on the mirrored root.

### 2. Align operator-facing docs with the new filename

Completes AC-26-2 (docs side of the matched pair).

- **Files**
  - `skills/bootstrap/templates/patinaproject-supplement/RELEASING.md` (line
    123, paragraph naming the dispatched workflow).
  - `skills/bootstrap/templates/core/RELEASING.md` (line 123, same shared
    paragraph).
  - `RELEASING.md` (line 123, mirrored root).
  - `skills/bootstrap/SKILL.md` (lines 128 and 162, both naming the dispatched
    workflow as part of current guidance).
  - `skills/bootstrap/audit-checklist.md` (line 45, end-to-end release smoke
    row naming the dispatched workflow as part of the smoke check).
- **Edit detail** — Replace `bump-plugin-tags.yml` with `plugin-release-bump.yml`
  in each location. Prose around it stays unchanged. Do not touch references
  under `docs/superpowers/specs/**` or `docs/superpowers/plans/**`; per the
  design, those are point-in-time historical records and out of scope.
- **Verification**
  - `rg -n 'bump-plugin-tags\.yml' skills/bootstrap/templates .github/workflows RELEASING.md skills/bootstrap/SKILL.md skills/bootstrap/audit-checklist.md`
    returns no matches.
  - `rg -n 'bump-plugin-tags' .` returns hits only under
    `docs/superpowers/specs/**` and `docs/superpowers/plans/**` (historical),
    confirming the doc-alignment scope from the design.
  - `pnpm lint:md` passes.

## ATDD hooks

The acceptance criteria in the design are verified by the following hooks
during plan execution:

- **AC-26-1** — Authoritative confirmation is post-merge on the next real
  release (`gh run view` on `patinaproject/bootstrap` and
  `gh run list --workflow=plugin-release-bump.yml --repo patinaproject/skills`,
  per the design's verification block). Pre-merge proxy:
  `rg -n 'plugin-release-bump\.yml' skills/bootstrap/templates/patinaproject-supplement/.github/workflows/release.yml .github/workflows/release.yml`
  shows the new filename on the `workflow:` input line in both files, and
  `actionlint` (CI) passes on the workflow change.
- **AC-26-2** — Pre-merge:
  `rg -n 'bump-plugin-tags\.yml' skills/bootstrap/templates .github/workflows RELEASING.md skills/bootstrap/SKILL.md skills/bootstrap/audit-checklist.md`
  returns no matches; `rg -n 'plugin-release-bump\.yml' skills/bootstrap/templates/patinaproject-supplement/.github/workflows/release.yml .github/workflows/release.yml`
  shows the new filename in both files; `pnpm lint:md` passes; the PR body's
  `Docs updated` section lists the template edit and the mirrored root edit as
  a matched pair and references the templates-first loop.

## Risks and rollback

- **Risk** — Pure rename of a string used only as an HTTP path segment in the
  workflow-dispatch call. No behavior change, no permissions change, no token
  change. The historical references under `docs/superpowers/**` are
  intentionally left intact and so cannot create drift with current docs;
  current docs all move together.
- **Rollback** — Revert the single commit. The workflow returns to dispatching
  `bump-plugin-tags.yml` (the pre-fix, broken state) with no other side
  effects.

## Blockers

None.
