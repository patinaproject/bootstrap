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

  Keep checklist items concrete and actionable. Do not add this section for
  placeholders such as `None`, `N/A`, or `No work-specific pre-merge operator
  steps.` To include an intentionally optional checkbox, put a
  `pr-checkbox: optional` HTML comment immediately above that checkbox.
-->

## Test coverage

<!--
  Include one row per in-scope AC. Keep the `Unit` column, then add one column
  per supported platform for this project. Remove unsupported platform columns
  before opening the PR. Status cells must use only these symbols, not words
  like `tested`:
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
  Test rows are optional and only belong here when they report meaningful
  platform validation for this AC. Fields are pipe-separated in fixed order:
  runner | env | verifier | ISO (UTC timestamp). Do not include unit-test rows
  or detached `- Test:` bullets. Use a neutral verifier value, such as a
  person, role, or run identifier. Do not include `@claude`, `@codex`, or
  similar agent trigger mentions unless you intentionally want to trigger that
  agent in a supported GitHub surface.
-->
- <Platform> test – <runner> | <env> | <verifier> | <ISO>
<!--
  Manual test rows are only for steps the operator needs to perform. When
  present, they must be unchecked operator-review checkboxes using the literal
  prefix `Manual test:` and concrete numbered steps. Agents must never check
  these boxes and must never write manual tests as plain bullets. Do not relabel
  command output, lint results, or other author-run verification as manual
  tests.
-->
- [ ] Manual test: <concrete numbered steps; observed outcome>
<!--
  Add a visible Test gap row only when automated coverage has a real gap that
  the operator must consciously review. When present, it must be an unchecked
  operator-review checkbox. Agents must never check this box and must never
  write test gaps as plain bullets. When automated coverage is comprehensive,
  omit the row entirely – do not use placeholder phrases like `no known gap`,
  `none required`, `n/a`, `not applicable`, or `automated coverage is sufficient`.
  Example: - [ ] ⚠️ Test gap: <what automated coverage does not verify>
-->

### AC-<issue>-<n>

Deferred to `<repo-or-follow-up>`.
