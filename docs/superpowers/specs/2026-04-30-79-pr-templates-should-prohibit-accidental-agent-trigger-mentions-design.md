# Design: PR templates should prohibit accidental agent trigger mentions [#79](https://github.com/patinaproject/bootstrap/issues/79)

## Intent

Make the bootstrap PR body contract prevent accidental agent trigger mentions in
verifier fields while keeping acceptance-criteria reports compact. The template
should name neutral verifier values, avoid bot-handle examples, keep the `Unit`
summary column in the `Test coverage` matrix, and keep detailed unit command
output out of per-AC summaries so reviewers see the decisions they need.

## Requirements

- R1: The canonical PR template explicitly says not to include `@claude`,
  `@codex`, or similar agent trigger mentions unless the trigger is
  intentional.
- R2: Test verifier guidance uses neutral values such as a person, role, or run
  identifier.
- R3: The `Test coverage` matrix keeps the `Unit` column and only adds
  supported platform columns.
- R4: Per-AC test rows report meaningful platform validation.
- R5: Per-AC reports summarize the AC outcome and keep detailed unit command
  output in the coverage matrix.
- R6: The emitted bootstrap core template, root template, and traceability docs
  describe the same PR-body grammar.
- R7: `Test coverage` matrix status cells use the template's status symbols.
- R8: `Manual test:` rows capture every known step the operator needs to
  perform.
- R9: Test-gap rows capture every known coverage gap the operator needs to
  review.
- R10: Manual-test rows and test-gap rows are unchecked operator-review
  checkboxes.
- R11: When updating an existing PR body, every existing manual-review
  instruction stays under its AC as an unchecked manual-test checkbox.
- R12: Checkbox items use imperative style so the operator can act on them
  directly.

## Acceptance criteria

- AC-79-1: Given an agent or human opens the bootstrap PR template, when they
  read the PR body guidance, then it explicitly says not to include `@claude`,
  `@codex`, or similar agent trigger mentions unless the trigger is
  intentional.
- AC-79-2: Given the bootstrap core template is emitted into a downstream
  repository, when a PR body follows the generated template, then test evidence
  uses a neutral verifier value and does not encourage bot handles.
- AC-79-3: Given the root bootstrap PR template and the emitted core template
  both define the canonical PR body structure, when this issue is implemented,
  then both templates contain aligned guidance for avoiding accidental agent
  mentions.
- AC-79-4: Given an author fills the acceptance-criteria reports in the
  bootstrap PR template, when they add test coverage or per-AC verification,
  then the template keeps the `Unit` coverage summary column and keeps detailed
  unit command output out of the per-AC summaries.
- AC-79-5: Given an author fills the `Test coverage` matrix, when they mark an
  AC status, then the template tells them to use the status symbols.
- AC-79-6: Given an author fills an acceptance-criteria report, when they add a
  `Manual test:` row, then the template tells them to include every known step
  the operator needs to perform.
- AC-79-7: Given an author fills an acceptance-criteria report, when they add a
  manual-test or test-gap row, then the template shows every known item as an
  unchecked operator-review checkbox.
- AC-79-8: Given an author updates an existing PR body, when that body already
  contains manual-review instructions, then the template preserves each
  instruction under its AC as an unchecked manual-test checkbox.
- AC-79-9: Given an author adds an operator-review checkbox, when the checkbox
  is written, then its text uses imperative style.

## Surfaces

- `skills/bootstrap/templates/core/.github/pull_request_template.md`
- `.github/pull_request_template.md`
- `docs/ac-traceability.md`
- `docs/superpowers/specs/2026-04-30-79-pr-templates-should-prohibit-accidental-agent-trigger-mentions-design.md`

## Workflow-Contract Safeguards

- RED baseline: the previous PR template required per-AC unit/platform rows,
  which encouraged noisy AC reports even when unit-test details did not add
  reviewer-useful evidence.
- GREEN target: the template keeps the `Unit` summary column, platform
  validation, every known operator-needed manual test, and every known test gap
  visible while preserving existing per-AC manual-review instructions and
  keeping detailed unit command output out of AC prose.
- Rationalization resistance: the template explicitly keeps the `Unit` matrix
  column, names symbolic matrix statuses, names platform test row fields, and
  shows manual-test and test-gap rows as unchecked operator-review checkboxes.
- Token efficiency: detailed grammar stays in the PR template comments, while
  `docs/ac-traceability.md` points to the canonical template for the full rule
  set.
- Role ownership: authors decide which platform evidence is meaningful;
  reviewers inspect AC outcomes and gaps; operators see checkboxes only for
  actual pre-merge actions.
- Stage-gate bypass prevention: root/template parity and traceability checks
  keep downstream bootstrap output aligned with the root PR template.

## Adversarial Review

Status: clean.

Reviewer context: same-thread fallback.

Checked dimensions:

- RED/GREEN baseline obligations are documented above.
- Rationalization resistance is present through explicit Unit-summary vs.
  unit-detail-row wording.
- Matrix status rationalization is closed by showing the symbolic status set.
- Manual-test rationalization is closed by naming operator-needed steps as the
  included manual-test content.
- Test-gap and manual-test checkbox rationalization is closed by showing the
  unchecked operator-review checkbox form.
- Lossy summarization is closed by requiring every known operator-needed manual
  step and every known test gap to be carried forward.
- PR-update loss is closed by requiring existing manual-review instructions to
  stay attached to their ACs.
- Checkbox ambiguity is closed by requiring imperative operator-facing text.
- Red flags are addressed by preserving platform evidence and visible
  gap reporting.
- Token efficiency is preserved by avoiding duplicate grammar outside the
  template.
- Role ownership is explicit in the template and design.
- Stage-gate bypass paths are closed by root/template parity checks.

Findings: none.
