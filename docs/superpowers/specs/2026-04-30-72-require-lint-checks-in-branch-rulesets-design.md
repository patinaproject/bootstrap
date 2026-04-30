# Design: Require Lint checks in branch rulesets [#72](https://github.com/patinaproject/bootstrap/issues/72)

## Summary

Require the GitHub Actions `Lint` check in repository rulesets and make the
actionlint workflow safe to require by ensuring it runs for every pull request.
The source template and mirrored root workflow must stay aligned.

## Context

Issue #72 was filed after discovering two merge-readiness gaps:

- the active inherited branch rulesets for this repository did not include a
  `required_status_checks` rule for `Lint`;
- `.github/workflows/actions.yml` used a pull request `paths` filter, so a
  required `Lint` check from that workflow could stay pending when a pull
  request did not touch workflow files.

This repository treats `skills/bootstrap/templates/**` as the source of truth
for baseline files, so the actionlint workflow change must be made in the
template first and mirrored into the root workflow.

## Requirements

- R1: A protected-branch ruleset must require the GitHub Actions `Lint` status
  check before merge.
- R2: The required `Lint` context must come from the GitHub Actions app so it
  matches the check-run context emitted by the repository workflows.
- R3: The actionlint workflow must not use a pull request `paths` filter,
  because a skipped workflow can leave a required check pending.
- R4: The template workflow at
  `skills/bootstrap/templates/core/.github/workflows/actions.yml` and the root
  workflow at `.github/workflows/actions.yml` must stay in parity.
- R5: The change must not alter unrelated release or markdown lint behavior.
- R6: If inherited organization rulesets cannot be edited from the current
  token, a repository-owned ruleset may enforce the same required check for
  `~DEFAULT_BRANCH` and `refs/heads/production`.

## Acceptance Criteria

- AC-72-1: Given a pull request targets a protected branch, when branch
  protection or repository rulesets evaluate merge readiness, then the GitHub
  Actions `Lint` status check is required.
- AC-72-2: Given the actionlint workflow exists, when a pull request is opened,
  edited, synchronized, or reopened, then the workflow is not skipped by a pull
  request `paths` filter.
- AC-72-3: Given the bootstrap repository mirrors baseline config from
  templates, when the actionlint workflow changes, then the source template and
  root workflow remain aligned.

## Design

Add or update ruleset enforcement so the repository has an active branch
ruleset requiring the `Lint` check context from GitHub Actions. The intended
protected refs are the default branch and production branch:

- `~DEFAULT_BRANCH`
- `refs/heads/production`

Remove the `paths` filter from the actionlint workflow trigger in both the
source template and mirrored root workflow. The workflow should continue to run
on the same pull request activity types:

- `opened`
- `edited`
- `synchronize`
- `reopened`

Do not rename workflow jobs or status contexts as part of this change. The
required status-check context is `Lint`, matching the current job names across
the repository's CI workflows.

## Workflow-Contract Pressure Tests

This change touches workflow-contract surfaces, so review must check the
following dimensions before publish:

- RED baseline: confirm the pre-change ruleset state lacks a required
  `Lint` status-check rule and the actionlint workflow contains a `paths`
  filter.
- GREEN behavior: confirm the active ruleset requires `Lint` and `paths:` is
  absent from both actionlint workflow copies.
- Rationalization resistance: reject arguments that a path-filtered workflow is
  acceptable for a required check because it saves runner time.
- Red flags: ensure `Lint` is not renamed, ensure ruleset enforcement is active,
  and ensure root/template workflow copies stay aligned.
- Token efficiency: keep new guidance minimal; do not add broad CI doctrine when
  the concrete invariant is enough.
- Role ownership: `Finisher` owns live ruleset verification and PR publish-state
  checks; `Executor` owns file changes and command verification.
- Stage-gate bypass paths: do not treat the live ruleset mutation alone as
  complete without the branch workflow/template diff and PR evidence.

## Non-Goals

- Do not change unrelated release workflow behavior.
- Do not change markdown lint globs or workflow naming.
- Do not manually apply or remove Release Please reserved labels.
- Do not require editing inherited organization rulesets when repository-level
  enforcement can satisfy the issue.

## Verification Plan

- Inspect the active ruleset and confirm a `required_status_checks` rule for
  `Lint` with the GitHub Actions integration.
- Run `rg -n "paths:" .github/workflows/actions.yml skills/bootstrap/templates/core/.github/workflows/actions.yml`
  and expect no matches.
- Run `actionlint` against root and template workflows, or document that
  `actionlint` is unavailable and rely on CI.
- Review `git diff` to confirm root/template workflow parity.
