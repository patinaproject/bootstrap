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
  Include this section only when work-specific operator steps must happen after
  review and before merge:

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

  Use `➖` only when that verification type is not relevant to the AC. If an
  AC includes evidence, a test gap, a manual review item, or a manual test item
  for a platform or verification type, its matrix cell must not be `➖`.
-->
| AC | Title | Unit | <Platform> |
| --- | --- | --- | --- |
| AC-<issue>-<n> | <short title> | ➖ | ➖ |

## Acceptance criteria

<!--
  One heading per relevant AC. AC IDs follow the convention in
  docs/ac-traceability.md. Under each AC, use this order when present:
  summary, platform evidence rows, test-gap checkboxes, manual-review
  checkboxes, manual-test checkboxes.
-->

### AC-<issue>-<n>

Short outcome summary.

<!--
  For each supported platform that is relevant to this AC, include one evidence
  row or report the missing validation as a test-gap checkbox. Fields are
  pipe-separated in fixed order: runner | env | verifier | ISO (UTC timestamp).
  Use a neutral verifier value, such as a person, role, or run identifier. Do
  not put an `@` immediately before agent names such as Claude or Codex unless
  you intentionally want to trigger that agent in a supported GitHub surface.
  If an unresolved critical or major review finding affects validation for this
  AC, include it as a test-gap checkbox unless it belongs in Do before merging.
-->
- <Platform> test – <runner> | <env> | <verifier> | <ISO>
<!--
  Include every known Test gap that the operator must consciously review. Write
  each gap as an unchecked operator-review checkbox. Phrase checkbox text in
  imperative style.
  Example: - [ ] ⚠️ Test gap: Review <what automated coverage does not verify>
-->
- [ ] ⚠️ Test gap: Review <missing coverage or unverified behavior>
<!--
  Include every known operator audit or inspection step below any test-gap
  checkboxes and above any manual-test checkboxes for this AC. Use the literal
  prefix `Manual review:` for diff inspection, coverage-report review, review
  finding review, deployment evidence review, or other operator review work
  that does not exercise the product directly. Phrase checkbox text in
  imperative style.
-->
- [ ] Manual review: <imperative review or audit step and expected decision>
<!--
  Include every known manual product test step the operator needs to perform
  below any test-gap and manual-review checkboxes for this AC. Write each one
  as an unchecked operator-review checkbox using the literal prefix
  `Manual test:` and concrete numbered steps. When updating an existing PR body,
  preserve every existing manual-review instruction under its AC as either
  `Manual review:` or `Manual test:` based on whether it inspects evidence or
  exercises product behavior. Phrase checkbox text in imperative style.
-->
- [ ] Manual test: <imperative operator steps and expected result>

### AC-<issue>-<n>

Deferred to `<repo-or-follow-up>`.
