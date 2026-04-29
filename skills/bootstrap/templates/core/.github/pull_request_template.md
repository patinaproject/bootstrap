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

## Do before merging

<!--
  Add checklist items only for work-specific operator steps that must happen
  after review and before merge. Omit this section's checklist when no
  work-specific pre-merge steps are required.
  Visible unchecked checkboxes are enforced by the `Required template
  checkboxes` status check. To include an intentionally optional checkbox, put
  `<!-- pr-checkbox: optional -->` immediately above that checkbox.
  Example: - [ ] Rotate the production secret after deploy.
-->

## Test coverage

<!--
  Include one row per in-scope AC. Keep the `Unit` column, then add one column
  per supported platform for this project. Remove unsupported platform columns
  before opening the PR. Use:
  ✅ tested
  ❌ required but missing/failing
  ➖ not applicable for this AC
-->
| AC | Title | Unit | <Platform> |
| --- | --- | --- | --- |
| AC-<issue>-<n> | <short title> | ➖ | ➖ |

## Acceptance criteria

<!-- One heading per relevant AC. AC IDs follow the convention in docs/ac-traceability.md. -->

### AC-<issue>-<n>

Short outcome summary.

<!--
  Test rows: one per covered Unit/platform target. Fields are pipe-separated
  in fixed order: runner | env | verifier | ISO (UTC timestamp). Omit test
  rows only for ACs explicitly marked `[platform: none]`. Do not use detached
  `- Test:` bullets.
-->
- <Unit-or-platform> test – <runner> | <env> | <verifier> | <ISO>
<!--
  Manual test row uses the literal prefix `Manual test:` and concrete numbered
  steps. Do not use a checkbox unless the row is an operator action that must be
  performed before merge.
-->
- Manual test: <concrete numbered steps; observed outcome>
<!--
  Add a visible Test gap row only when automated coverage has a real gap that a
  reviewer must consciously accept. When automated coverage is comprehensive,
  omit the row entirely – do not use placeholder phrases like `no known gap`,
  `none required`, `n/a`, `not applicable`, or `automated coverage is sufficient`.
  Example: - ⚠️ Test gap: <what automated coverage does not verify>
-->

### AC-<issue>-<n>

Deferred to `<repo-or-follow-up>`.
