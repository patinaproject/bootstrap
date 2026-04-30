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
  supported platform columns affected by the PR.
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
- R10: Manual-review rows, manual-test rows, and test-gap rows are unchecked
  operator-review checkboxes.
- R11: When updating an existing PR body, every existing manual-review
  instruction stays under its AC as the correct unchecked manual-review or
  manual-test checkbox type.
- R12: Checkbox items use imperative style so the operator can act on them
  directly.
- R13: Matrix status cells contain only the status symbols, with explanatory
  text kept outside the cells.
- R14: Missing relevant platform validation is reported as a test-gap checkbox.
- R15: Manual-test checkboxes describe operator steps and expected results
  without implying the agent has observed the outcome.
- R16: Per-AC content order is stable: summary, platform evidence rows,
  test-gap checkboxes, manual-review checkboxes, then manual-test checkboxes.
- R17: Operator audit or inspection work uses `Manual review:` while product
  behavior exercises use `Manual test:`.
- R18: Matrix `➖` means not relevant, not omitted; any shown evidence, gap,
  manual review, or manual test makes the matching matrix cell non-`➖`.
- R19: Unresolved critical or major review findings that affect validation are
  reported as test-gap checkboxes unless they belong in `Do before merging`.

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
  manual-review, manual-test, or test-gap row, then the template shows every
  known item as an unchecked operator-review checkbox.
- AC-79-8: Given an author updates an existing PR body, when that body already
  contains manual-review instructions, then the template preserves each
  instruction under its AC as the correct unchecked manual-review or
  manual-test checkbox type.
- AC-79-9: Given an author adds an operator-review checkbox, when the checkbox
  is written, then its text uses imperative style.
- AC-79-10: Given an author fills the `Test coverage` matrix, when they mark an
  AC status, then each status cell contains only a status symbol.
- AC-79-11: Given an AC has a relevant supported platform without validation,
  when the author fills that AC report, then the missing validation appears as
  a test-gap checkbox.
- AC-79-12: Given an author adds a manual-test checkbox, when they describe the
  operator work, then the checkbox names steps and expected results instead of
  implying an already observed outcome.
- AC-79-13: Given an author fills an AC report, when they include evidence,
  gaps, and manual tests, then the content follows the template order with
  manual tests below test gaps.
- AC-79-14: Given an author adds operator inspection work, when the work reviews
  diffs, coverage, review findings, deployment evidence, or similar evidence
  without exercising product behavior, then the checkbox uses the
  `Manual review:` prefix.
- AC-79-15: Given an author fills the matrix and per-AC report, when an AC
  includes evidence, a gap, a manual review item, or a manual test item for a
  verification type, then the matching matrix cell is not `➖`.
- AC-79-16: Given a critical or major review finding affects validation, when
  the author updates the AC report, then the finding appears as a test-gap
  checkbox unless it belongs in `Do before merging`.

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
  visible while distinguishing operator evidence review from product manual
  testing and keeping detailed unit command output out of AC prose.
- Rationalization resistance: the template explicitly keeps the `Unit` matrix
  column, names symbol-only matrix statuses, requires platform evidence or an
  explicit gap for relevant supported platforms, names platform test row fields,
  shows manual-review, manual-test, and test-gap rows as unchecked
  operator-review checkboxes, and prevents `➖` from hiding reported evidence or
  gaps.
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
- Matrix status copying is closed by requiring symbol-only cells.
- Manual-test rationalization is closed by naming operator-needed steps as the
  included manual-test content.
- Manual-test result invention is closed by asking for expected results instead
  of observed outcomes.
- Test-gap and manual-test checkbox rationalization is closed by showing the
  unchecked operator-review checkbox form.
- Test-gap omission is closed by showing a visible test-gap checkbox placeholder.
- Lossy summarization is closed by requiring every known operator-needed manual
  step and every known test gap to be carried forward.
- Manual-review ambiguity is closed by separating `Manual review:` from
  `Manual test:`.
- Matrix inconsistency is closed by requiring any evidence, gap, manual review,
  or manual test to make the matching cell non-`➖`.
- Review-finding loss is closed by requiring validation-affecting critical or
  major findings to appear as test gaps or pre-merge tasks.
- Platform loss is closed by requiring evidence or a test-gap checkbox for each
  relevant supported platform.
- PR-update loss is closed by requiring existing manual-review instructions to
  stay attached to their ACs.
- Checkbox ambiguity is closed by requiring imperative operator-facing text.
- AC section drift is closed by naming the summary, platform evidence,
  test-gap, manual-review, and manual-test order.
- Red flags are addressed by preserving platform evidence and visible
  gap reporting.
- Token efficiency is preserved by avoiding duplicate grammar outside the
  template.
- Role ownership is explicit in the template and design.
- Stage-gate bypass paths are closed by root/template parity checks.

Findings: none.
