# Design: PR templates should prohibit accidental agent trigger mentions [#79](https://github.com/patinaproject/bootstrap/issues/79)

## Intent

Make the bootstrap PR body contract prevent accidental agent trigger mentions in
verifier fields while keeping acceptance-criteria reports compact. The template
should name neutral verifier values, avoid bot-handle examples, keep the `Unit`
summary column in the `Test coverage` matrix, and omit per-AC unit-test detail
rows because they add noise without improving review decisions.

## Requirements

- R1: The canonical PR template explicitly says not to include `@claude`,
  `@codex`, or similar agent trigger mentions unless the trigger is
  intentional.
- R2: Test verifier guidance uses neutral values such as a person, role, or run
  identifier instead of bot handles.
- R3: The `Test coverage` matrix keeps the `Unit` column and only adds
  supported platform or project validation columns.
- R4: Per-AC test rows are optional and only report meaningful project or
  platform validation.
- R5: Per-AC reports explicitly forbid unit-test rows and detached `Test:`
  bullets.
- R6: The emitted bootstrap core template, root template, and traceability docs
  describe the same PR-body grammar.
- R7: `Test coverage` matrix status cells use only the template's status
  symbols and explicitly reject word statuses such as `tested`.

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
  then the template keeps the `Unit` coverage summary column while omitting
  unit-test detail rows from the per-AC sections.
- AC-79-5: Given an author fills the `Test coverage` matrix, when they mark an
  AC status, then the template tells them to use the status symbols instead of
  word statuses such as `tested`.

## Surfaces

- `skills/bootstrap/templates/core/.github/pull_request_template.md`
- `.github/pull_request_template.md`
- `docs/ac-traceability.md`
- `docs/superpowers/specs/2026-04-30-79-pr-templates-should-prohibit-accidental-agent-trigger-mentions-design.md`

## Workflow-Contract Safeguards

- RED baseline: the previous PR template required per-AC unit/platform rows,
  which encouraged noisy AC reports even when unit-test details did not add
  reviewer-useful evidence.
- GREEN target: the template keeps the `Unit` summary column, platform/project
  validation, manual tests, and real test gaps visible while removing unit-test
  detail rows from AC reports.
- Rationalization resistance: the template explicitly keeps the `Unit` matrix
  column, forbids unit-test rows under AC sections, forbids detached `Test:`
  bullets, and rejects word statuses such as `tested` in matrix cells.
- Token efficiency: detailed grammar stays in the PR template comments, while
  `docs/ac-traceability.md` points to the canonical template instead of
  duplicating all rules.
- Role ownership: authors decide which platform/project evidence is meaningful;
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
- Matrix status rationalization is closed by the explicit no-word-status rule.
- Red flags are addressed by preserving platform/project evidence and visible
  gap reporting.
- Token efficiency is preserved by avoiding duplicate grammar outside the
  template.
- Role ownership is explicit in the template and design.
- Stage-gate bypass paths are closed by root/template parity checks.

Findings: none.
