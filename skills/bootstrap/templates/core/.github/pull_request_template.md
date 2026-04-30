# Pull Request

<!--
  PR title rule for squash merges: use the exact commitlint/commitizen format
  for the PR title so the squash commit can be reused unchanged.
  Pattern: `type: \#123 short description`
  Examples:
  - `docs: \#12 add bootstrap skill guide`
  - `chore: \#34 bootstrap commit hooks`
  This title rule applies to pull requests only. GitHub issue titles should stay
  plain-language and should not use conventional-commit prefixes.

  Do not put an `@` immediately before agent names such as Claude or Codex
  anywhere in the PR body unless you intentionally want to trigger that agent in
  a supported GitHub surface.
-->

## Linked issue

- `Closes #<issue>` when this PR is intended to complete the issue
- Otherwise: `Related to #<issue>` plus a short explanation of why this PR does not close it yet
- `None` when no issue applies

## What changed

-

<!--
  Include this section only when PR-level operator steps that do not belong to
  a specific AC must happen after review and before merge:

  ## Do before merging

  - [ ] Rotate the production secret after deploy.

  Keep checklist items concrete, actionable, and imperative. Do not duplicate
  AC-specific test gaps or operator checks here. Do not add this section for
  placeholders such as `None`, `N/A`, or `No work-specific pre-merge operator
  steps.` To include an intentionally optional checkbox, put a
  `pr-checkbox: optional` HTML comment immediately above that checkbox.
-->

## Test coverage

<!--
  Include one row per AC with validation evidence, a required test gap, or an
  operator check. Keep the `Unit` column, then add one column per supported
  platform affected by this PR. Deferred or bookkeeping-only ACs may be
  summarized in the AC section without a matrix row. Use only these symbols in
  status cells:
  ✅ = tested
  ❌ = required but missing/failing
  ➖ = not applicable for this AC

  Use `➖` only when that verification type is not relevant to the AC. If an AC
  includes evidence, a test gap, or an operator check that clearly maps to a
  matrix column, that cell must not be `➖`.
-->
| AC | Title | Unit | <Platform> |
| --- | --- | --- | --- |
| AC-<issue>-<n> | <short title> | ➖ | ➖ |

## Acceptance criteria

<!--
  One heading per relevant AC. AC IDs follow the convention in
  docs/ac-traceability.md. Under each AC, use this order when present:
  summary, evidence rows, test-gap checkboxes, operator-check checkboxes.
-->

### AC-<issue>-<n>

Short outcome summary.

<!--
  For each supported platform that is relevant to this AC, include one evidence
  row or report the missing validation as a test-gap checkbox. Keep evidence
  rows compact and use a colon after the evidence label:
  `<Platform> test: <command, workflow job, tool, or harness>, <environment>[, <verifier or ISO>]`.
  Name the concrete command, workflow job, tool, or harness when known. Use a
  neutral verifier value, such as a person, role, or run identifier.
  If an unresolved critical or major review finding affects validation for this
  AC, include it as a test-gap checkbox unless it belongs in Do before merging.
-->
- <Platform> test: <command, workflow job, tool, or harness>, <environment>[, <verifier or ISO>]
<!--
  Include every known Test gap that the operator must consciously review. Write
  each gap as an unchecked checkbox for the operator. Phrase checkbox text in
  imperative style. Use `Test gap:` when coverage is missing or an unresolved
  validation concern remains.
  Example: - [ ] ⚠️ Test gap: Review <what automated coverage does not verify>
-->
- [ ] ⚠️ Test gap: Review <missing coverage or unverified behavior>
<!--
  Include every known operator action below any test-gap checkboxes for this
  AC. Use the literal prefix `Operator check:` for product testing, diff
  inspection, coverage-report review, review-finding review, deployment
  evidence review, or other operator work. Do not add generic diff-review
  checks unless the operator must inspect a specific risk, artifact, or
  unresolved decision. Do not duplicate a test gap as an operator check unless
  the operator action can close or validate the gap. When updating an existing
  PR body, preserve every existing manual-review or manual-test instruction
  under its AC in this checkbox form. Phrase checkbox text in imperative style.
  Delete unused placeholder checkbox rows.
-->
- [ ] Operator check: <imperative operator action and expected decision or result>

### AC-<issue>-<n>

Deferred to `<repo-or-follow-up>`.
