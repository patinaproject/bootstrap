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

  Keep checklist items concrete, actionable, and imperative. Do not add this
  section for placeholders such as `None`, `N/A`, or `No work-specific
  pre-merge operator steps.` To include an intentionally optional checkbox, put
  a `pr-checkbox: optional` HTML comment immediately above that checkbox.
-->

## Test coverage

<!--
  Include one row per in-scope AC. Keep the `Unit` column, then add one column
  per supported platform affected by this PR. Use only these symbols in status
  cells:
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
  rows compact: `<Platform> test – <runner>, <environment>[, <verifier or ISO>]`.
  Use a neutral verifier value, such as a person, role, or run identifier. Do
  not put an `@` immediately before agent names such as Claude or Codex unless
  you intentionally want to trigger that agent in a supported GitHub surface.
  If an unresolved critical or major review finding affects validation for this
  AC, include it as a test-gap checkbox unless it belongs in Do before merging.
-->
- <Platform> test – <runner>, <environment>[, <verifier or ISO>]
<!--
  Include every known Test gap that the operator must consciously review. Write
  each gap as an unchecked checkbox for the operator. Phrase checkbox text in
  imperative style.
  Example: - [ ] ⚠️ Test gap: Review <what automated coverage does not verify>
-->
- [ ] ⚠️ Test gap: Review <missing coverage or unverified behavior>
<!--
  Include every known operator action below any test-gap checkboxes for this
  AC. Use the literal prefix `Operator check:` for product testing, diff
  inspection, coverage-report review, review-finding review, deployment
  evidence review, or other operator work. When updating an existing PR body,
  preserve every existing manual-review or manual-test instruction under its AC
  in this checkbox form. Phrase checkbox text in imperative style.
-->
- [ ] Operator check: <imperative operator action and expected decision or result>

### AC-<issue>-<n>

Deferred to `<repo-or-follow-up>`.
