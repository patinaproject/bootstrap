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
  per supported platform for this project. Use only these symbols in status
  cells:
  ✅ = tested
  ❌ = required but missing/failing
  ➖ = not applicable for this AC
-->
| AC | Title | Unit | <Platform> |
| --- | --- | --- | --- |
| AC-<issue>-<n> | <short title> | ➖ | ➖ |

## Acceptance criteria

<!--
  One heading per relevant AC. AC IDs follow the convention in
  docs/ac-traceability.md. Under each AC, use this order when present:
  summary, platform evidence rows, test-gap checkboxes, manual-test checkboxes.
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
  Include every known manual test step the operator needs to perform below any
  test-gap checkboxes for this AC. Write each one as an unchecked
  operator-review checkbox using the literal prefix `Manual test:` and concrete
  numbered steps. When updating an existing PR body, preserve every existing
  manual-review instruction under its AC in this checkbox form. Phrase checkbox
  text in imperative style.
-->
- [ ] Manual test: <imperative operator steps and expected result>

### AC-<issue>-<n>

Deferred to `<repo-or-follow-up>`.
