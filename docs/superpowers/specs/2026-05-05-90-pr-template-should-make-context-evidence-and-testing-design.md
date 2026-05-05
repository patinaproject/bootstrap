# Design: PR template should make context, evidence, and testing instructions self-explanatory to reviewers [#90](https://github.com/patinaproject/bootstrap/issues/90)

## Intent

Make the canonical pull request template legible to a first-time reviewer
without forcing them to open the markdown source. Today, load-bearing author
guidance (per-bullet rationale and linked context for `## What changed`), the
test-coverage symbol legend, the `AC` column meaning, and the definition of
"evidence" all live in HTML comments — invisible to QA, GitHub mobile, and
anyone reading the rendered PR body. There is also no canonical slot that
tells a reviewer how to exercise the change, which has caused downstream
repos to invent ad-hoc sections (e.g. "QA findings → AC mapping",
"Testing instructions") to fill the gap.

This design adds the smallest set of rendered prompts and definitions that
let a reviewer reconstruct *what changed, why, and how to verify it* from
the rendered body alone, while preserving the existing AC / test-coverage
grammar and round-trip discipline. It does not adopt QA's literal section
names; it interprets the underlying reviewer problems and lands rendered
fixes that work across mobile, web, CLI, library, and infra consumers.

## Requirements

- R1: The `## What changed` section contains a rendered (visible-in-body)
  one-line author prompt that names the two load-bearing inputs reviewers
  need: linked prior context (prior PR, prior QA pass, follow-up issue) and
  a short rationale per bullet. The prompt is concise enough to remain in
  the rendered body without ballooning the template.
- R2: The `## Test coverage` section renders a visible legend defining
  `✅`, `❌`, `⚠️`, `➖` with the same meanings already documented in the
  HTML comments and aligned with the `⚠️` semantics in #87 (validation
  exists with a known non-blocking gap is `⚠️`; merge-blocking missing or
  failing validation is `❌`). The legend lives in the rendered body, not
  in a comment.
- R3: The `## Test coverage` section renders a one-line clarification of
  the `AC` column ("`AC` references the acceptance-criteria IDs from the
  linked issue, in `AC-<issue>-<n>` form"), so a non-author reviewer can
  interpret the column without prior context from `docs/ac-traceability.md`.
- R4: The `## Acceptance criteria` section renders a one-line definition of
  what an evidence row attests to (verifier, environment, command/workflow
  job/tool/harness), using the same terms already canonical in the HTML
  comment evidence-row grammar. The rendered definition does not duplicate
  the full grammar; it references the existing colon-style row format.
- R5: The template adds a new rendered section `## How to verify` between
  `## What changed` (or `## Do before merging` when present) and
  `## Test coverage`, so the reading order is *context → how a reviewer
  exercises the change → what the author already verified*. The section
  contains a short rendered author prompt explaining its purpose (give a
  reviewer or QA tester the steps to exercise the change for this repo's
  product surface) and an explicit `Not applicable — <one-line reason>`
  value the author writes when no manual verification is required.
  `## How to verify` is reviewer-facing manual-exercise instructions; it
  is not a place to duplicate AC evidence rows, which already record the
  author's completed verification claims.
- R6: The `## How to verify` section is product-surface-agnostic. Its
  rendered copy must not bake in product-surface-specific
  build-acquisition language for any surface (mobile, web, CLI, library,
  infra). Repo-specific examples (native build location, web build URL,
  CLI install command, library import snippet, infra dry-run command)
  live in HTML comments as illustrative hints, not in the rendered body.
- R7: When the author writes `Not applicable — <reason>` in
  `## How to verify`, the section is treated as filled, not as a
  placeholder. A bare `Not applicable` with no reason is a placeholder and
  must be rejected by the same placeholder-rejection discipline that
  governs other sections (e.g. the `Do before merging` rule).
- R8: The template body's added rendered prose (R1, R2, R3, R4, R5
  combined) stays under a token-efficiency budget so the rendered template
  does not balloon. Target: the diff against the current template adds no
  more than roughly 30 rendered lines (excluding HTML comments) across all
  five rendered additions. Calibration: R1≈1, R2≈4–6, R3≈1, R4≈1,
  R5≈5–8 ≈ 15–20 lines is the expected landing zone; ~30 is the cap, not
  a target.
- R9: Root `.github/pull_request_template.md` remains byte-identical to the
  bootstrap template source at
  `skills/bootstrap/templates/core/.github/pull_request_template.md`. The
  edit lands in the template first; the root file is mirrored via the
  bootstrap skill in realignment mode in the same PR.
- R10: `docs/ac-traceability.md` continues to delegate the detailed PR-body
  grammar to the canonical PR template. The doc is updated only if a
  direct contradiction with the new rendered legend or evidence definition
  exists.
- R11: PR authors and Superteam `Finisher` own filling the rendered
  context-prompt, legend-driven matrix cells, evidence rows, and
  `## How to verify` slot. `Reviewer` and `Finisher` own flagging missing
  or placeholder values before publish-state readiness. A
  `## How to verify` left as the literal placeholder string from the
  template (or as bare `Not applicable` with no reason) blocks readiness
  in the same way an unfilled `## What changed` does today.
- R12: The change coordinates with #87. If #87 has not landed at merge
  time, the rendered legend in this PR uses the #87 wording (`⚠️` =
  validation exists with a known non-blocking gap; `❌` = required
  validation missing, failing, pending, or merge-blocking) and #87's
  template-side legend edit becomes a fast-follow mirror, not a competing
  rewrite. The two PRs do not land conflicting legend copy.

## Non-Goals

- Do not redesign the test-coverage matrix schema, the AC ID grammar, or
  the per-AC content order. This issue is about rendered-body legibility,
  not a new schema.
- Do not adopt QA's literal section names (`Summary`, `Verification`,
  `QA findings → AC mapping`, `AC platform coverage`, `Testing
  instructions`). Their feedback is interpreted, not transcribed.
- Do not bake mobile/web/CLI/library/infra-specific build-acquisition copy
  into the canonical template body.
- Do not duplicate `docs/ac-traceability.md` content inside the PR body.
- Do not add automated PR-body linting for the new
  `## How to verify` section in this issue.
- Do not adopt "QA findings → AC mapping" as a canonical section. The
  underlying need (linking corrective work to the AC it satisfies) is
  already served by the existing per-AC structure.

## Acceptance Criteria

- AC-90-1: Given an author opens the PR template, when they fill the
  `## What changed` section, then the rendered body — not only an HTML
  comment — prompts them to surface linked prior context (prior PR, prior
  QA pass, follow-up issue) and to give each bullet a short rationale.
- AC-90-2: Given a reviewer opens a rendered PR body, when they read the
  `## Test coverage` matrix, then the symbol legend (`✅ ❌ ⚠️ ➖`) and the
  meaning of the `AC` column are visible in the rendered body without
  opening the markdown source.
- AC-90-3: Given a reviewer opens a rendered PR body, when they read an
  evidence row under an AC, then the rendered body conveys what evidence
  attests to (verifier, environment, command/workflow job/tool/harness)
  without prior context from `docs/ac-traceability.md` or other
  contributor docs.
- AC-90-4: Given a reviewer or QA tester opens the PR body, when they look
  for a way to verify the change, then the body contains a rendered,
  discoverable testing-instructions slot (`## How to verify`) that works
  across repo product surfaces, with an explicit
  `Not applicable — <reason>` value the author writes when no manual
  verification is required.
- AC-90-5: Given the canonical template under
  `skills/bootstrap/templates/core/.github/pull_request_template.md`
  changes, when the bootstrap skill runs in realignment mode against this
  repo, then the root `.github/pull_request_template.md` matches the
  template byte-for-byte (round-trip parity).

## Implementation Shape

1. Edit `skills/bootstrap/templates/core/.github/pull_request_template.md`:
   - Add a one-line rendered author prompt under `## What changed`
     covering linked prior context and per-bullet rationale (R1, AC-90-1).
   - Add a rendered legend block under `## Test coverage` defining the
     four symbols with the #87-aligned wording (R2, R12, AC-90-2).
   - Add a one-line rendered clarification of the `AC` column in
     `## Test coverage` (R3, AC-90-2).
   - Add a one-line rendered definition of evidence under
     `## Acceptance criteria` (R4, AC-90-3).
   - Insert a new rendered `## How to verify` section between
     `## What changed` (or `## Do before merging` when present) and
     `## Test coverage`, with a short prompt, a placeholder value, and a
     `Not applicable — <reason>` example (R5, R6, R7, AC-90-4).
   - Keep the rendered additions within the R8 token-efficiency budget.
2. Run the bootstrap skill in realignment mode against this repo, accept
   the proposed root diff, and commit the template change and the
   mirrored root change together (R9, AC-90-5).
3. Review `docs/ac-traceability.md` for direct contradictions with the
   new rendered legend or evidence definition; update only if needed
   (R10).
4. Cross-link with #87 in the PR body so the legend wording is landed
   once (R12).

## Verification

- RED-phase baseline (record before the template change lands):
  - Confirm the current rendered template body (HTML comments stripped)
    does not contain the four symbol meanings, the `AC` column meaning,
    a definition of evidence, the per-bullet-rationale prompt, or a
    `## How to verify` section. Capture this as the failing baseline so
    the rendered fix is observable.
  - Confirm the root and template files are already byte-identical
    (`cmp -s`) so any later drift is attributable to the change.
- GREEN-phase rendered checks after the change. Each rendered-visibility
  check first strips HTML comment blocks so the assertion is "this
  string appears in the rendered body", not "this string appears
  anywhere in the file" — because the existing template already mentions
  these symbols inside HTML comments and the failure mode this issue
  fixes is comment-only guidance. Use a portable strip such as:
  `sed -e '/<!--/,/-->/d' .github/pull_request_template.md` (treat the
  resulting stream as the rendered body for grep purposes).
  - `cmp -s skills/bootstrap/templates/core/.github/pull_request_template.md .github/pull_request_template.md`
    exits 0.
  - `grep -c '<!--' .github/pull_request_template.md` does not increase
    relative to the count needed to land the new rendered prompts (i.e.
    new author guidance is in the rendered body, not absorbed into HTML
    comments).
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F '✅'`
    matches at least once (the symbol is in the rendered body, not only
    in a comment); analogous checks for `❌`, `⚠️`, and `➖`.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'AC-'`
    matches the rendered `AC` column clarification at least once.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F '## How to verify'`
    matches.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'Not applicable'`
    matches the rendered placeholder grammar.
- Token-efficiency check: `git diff --stat` against the previous
  template shows the rendered additions stay within the R8 budget.
- Pressure test: open a sample PR body that uses the new template and
  verify a reader who has never opened `docs/ac-traceability.md` can
  answer (a) what the four symbols mean, (b) what `AC` columns reference,
  (c) what an evidence row attests to, (d) how to verify the change or
  why no manual verification is needed.

## Loophole Closure

The new rendered prompts and the `## How to verify` section introduce new
author/reviewer discipline. The following loopholes must be closed
explicitly so authors do not regress to invisible guidance.

- Forbid moving the new rendered prompts back into HTML comments. "It
  reads cleaner with the prompt hidden" is not an acceptable rationale;
  HTML-comment-only guidance is exactly the failure mode this design
  fixes.
- Forbid replacing `## How to verify` with a bare `N/A` or
  `Not applicable` (no reason). The author must write
  `Not applicable — <one-line reason>`. A bare placeholder is treated as
  unfilled.
- Forbid baking repo-specific build-acquisition copy (native build
  location, web build URL, CLI install command, library import snippet,
  infra dry-run command) into the rendered template body. Such hints
  belong in HTML comments as illustrative examples; the rendered body
  must remain product-surface-agnostic.
- Forbid adding "QA findings → AC mapping" as a canonical section under
  the guise of "this is what reviewers asked for". The underlying need
  is already served by the existing per-AC structure; reintroducing the
  ad-hoc section would duplicate AC content.
- Forbid editing only the root `.github/pull_request_template.md`. Every
  change must land in the bootstrap template source first and round-trip
  to root in the same PR; a root-only edit silently regresses every
  bootstrapped repo on the next realignment.

## Rationalization Resistance

| Excuse | Reality |
|--------|---------|
| "The HTML comment already explains it; rendering is noise." | HTML comments are invisible to QA, GitHub mobile, and screenshot reviewers. The whole point of #90 is that comment-only guidance failed in production. |
| "I'll keep the legend in the comment because the symbols are obvious." | They were not obvious; QA literally asked what `AC` and `evidence` meant. Render the legend. |
| "`How to verify` doesn't apply to this repo / this PR is doc-only / this is a release PR." | Then write `Not applicable — <one-line reason>`. The slot exists precisely so the author has to make that decision visible. |
| "I'll just put the iOS / TestFlight / Vercel preview steps in the canonical template." | Repo-specific build-acquisition copy is a non-goal. Put it in the consuming repo, not the bootstrap template. |
| "I'll edit the root template directly and round-trip later." | Round-trip discipline exists because every bootstrapped repo regresses on the next realignment otherwise. Template-first, mirror in the same PR. |
| "QA asked for a `Verification` section; I'll add one with that exact name." | Adopt the underlying need, not the literal section name. The current template's `## Test coverage` plus the new `## How to verify` covers the underlying problem without colliding with QA's older naming. |
| "Per-bullet rationale will balloon `What changed`." | One rendered line of guidance does not balloon anything. The R8 budget keeps the entire set of rendered additions under roughly 60 lines. |
| "I'll skip the rendered evidence definition because `docs/ac-traceability.md` already covers it." | The reviewer reading a PR body has not opened `docs/ac-traceability.md` and may not know it exists. A one-line rendered definition is the whole fix. |
| "`Not applicable` alone is fine; the reason is obvious from context." | If the reason were obvious it would not be the AC failure mode #90 already documented. Require the reason. |
| "I'll paste the AC evidence rows into `## How to verify` so a reviewer sees them in one place." | `## How to verify` is reviewer-facing manual-exercise instructions ("here's how *you* can run this"). AC evidence rows are author claims of already-completed verification ("here's what *I* ran and where it ran"). Duplicating one into the other doubles the body and erases the distinction. |

## Red Flags — STOP and reconsider

- You are about to land a PR-template change as `docs:` or `chore:`. The
  template is a product-surface glob (path-first rule, AGENTS.md). Use
  `feat:` or `fix:`.
- You are about to put the new author prompt, legend, AC clarification,
  evidence definition, or `## How to verify` body inside `<!-- ... -->`.
  That is the failure mode this design fixes.
- You are editing only `.github/pull_request_template.md` and leaving
  `skills/bootstrap/templates/core/.github/pull_request_template.md`
  untouched. Stop. Edit the template first, then mirror.
- You are baking iOS/TestFlight/Vercel/`npm install`/`pip install`/
  `terraform plan` copy into the rendered body of `## How to verify`.
  Stop. That copy is repo-specific; the canonical template stays
  product-surface-agnostic.
- The diff adds substantially more than the R8 budget of rendered lines.
  Stop. The fix is meant to be the smallest rendered prompts that make
  the body legible, not a rewrite.

## Token-Efficiency Targets

- Rendered additions across R1–R5 combined: ~30 lines or fewer in the
  rendered body (HTML comments excluded). Expected landing zone is
  ~15–20 lines (R1≈1, R2≈4–6, R3≈1, R4≈1, R5≈5–8); ~30 is the cap, not
  a target. Each individual rendered prompt is one to three lines.
- HTML-comment additions: bounded — comments may carry illustrative
  hints (e.g. example evidence rows, example
  `Not applicable — <reason>` strings) but must not balloon to replace
  contributor docs.
- The rendered template, opened on GitHub web at default zoom, should
  remain scannable in roughly one screen above `## Acceptance criteria`,
  matching the current template's scan-density.

## Role Ownership

- PR authors and Superteam `Finisher` own filling the rendered
  context-prompt under `## What changed`, choosing matrix cells against
  the rendered legend, writing evidence rows that match the rendered
  definition, and filling `## How to verify` (with content or with
  `Not applicable — <reason>`).
- `Reviewer` and `Finisher` own flagging missing or placeholder values
  before publish-state readiness. Specifically: a bare `Not applicable`
  with no reason, an unfilled `## How to verify`, evidence rows that do
  not name a verifier/environment/command, or matrix cells that
  contradict the rendered legend.
- `Brainstormer` (this artifact) owns the rendered prompts and the
  loophole-closure language; later issues that refine the prompts must
  preserve the loophole-closure invariants in this design.

## Stage-Gate Bypass Resistance

- "We can land the template edit without round-tripping" — bypassed by
  R9 plus the AGENTS.md round-trip discipline; the PR must include both
  the template change and the root mirror.
- "We can keep the new section in HTML comments to avoid breaking
  consumers" — bypassed by R1, R2, R3, R4, R5, which require rendered
  visibility; HTML-comment-only versions of these prompts do not satisfy
  the ACs.
- "We can reuse `Do before merging` instead of adding `## How to verify`"
  — bypassed by R5; `Do before merging` is for PR-level operator steps
  before merge, not for telling a reviewer how to exercise the change.
- "We can drop AC-90-5 because round-trip is implied" — bypassed by R9
  and the explicit AC-90-5 verifier; round-trip is part of every
  template change on this repo and must be observable in the PR.

## Cross-Reference

- `docs/ac-traceability.md`: AC-ID convention and Given/When/Then
  phrasing.
- `.github/pull_request_template.md`: current canonical template
  (will be mirrored from the bootstrap template source after this
  design's plan and implementation land).
- `skills/bootstrap/templates/core/.github/pull_request_template.md`:
  source of truth for the canonical template.
- Issue #87: `⚠️` semantics. Coordinate the rendered legend wording so
  #90 and #87 do not land conflicting copy.
- AGENTS.md: path-first commit-type rule (template change is a
  product-surface glob and ships as `feat:`).
