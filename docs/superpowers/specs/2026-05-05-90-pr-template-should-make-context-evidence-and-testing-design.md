# Design: PR template should make context, evidence, and testing instructions self-explanatory to reviewers [#90](https://github.com/patinaproject/bootstrap/issues/90)

## Intent

Make the canonical pull request template legible to a first-time reviewer
without forcing them to open the markdown source. Today, load-bearing
guidance — per-bullet rationale and linked context for `## What changed`,
the test-coverage symbol legend, the `AC` column meaning, and the
definition of "evidence" — lives in HTML comments, invisible to QA,
GitHub mobile, and anyone reading the rendered PR body. The
`## Acceptance criteria` section, even when filled, reads as a form
(`<Platform> test: <command>, <environment>`) with corporate-flavored
labels (`Operator check:`, `Test gap:`) that obscure what a reviewer
actually has to do.

This design lands two changes: rendered prompts/definitions for the
parts a reviewer needs to read at all (legend, AC column meaning,
evidence definition, structural placeholders under `## What changed`),
and a humanized rewrite of `## Acceptance criteria` that uses natural
prose and reviewer-friendly labels — and absorbs the role of "tell a
reviewer how to exercise the change" into per-AC reviewer-confirm
steps, scoped to the AC's outcome. There is no separate
`## How to verify` section: per-AC confirm steps replace it.

## Requirements

- R1: The `## What changed` section forces linked prior context (prior
  PR, prior QA pass, follow-up issue) and per-bullet rationale into the
  rendered body via the rendered template *structure*, not via rendered
  instructive prose. Concretely: a rendered `Context:` line the author
  replaces with the actual context (or `Context: standalone — <reason>`
  when there is none) and a rendered bullet shape that pairs the change
  with its rationale (e.g. `- <change> — <why>`). Detailed
  *instructions* — what counts as "context", how to phrase rationale —
  remain in HTML comments per PR-template convention. The rendered
  body's job is to show *filled output*, not to lecture authors. This
  closes the QA failure mode (bullets without context or rationale)
  without adding rendered prompt prose that reviewers must skim past.
- R2: The `## Test coverage` section renders a visible legend defining
  `✅`, `❌`, `⚠️`, `➖` with the same meanings already documented in the
  HTML comments and aligned with the `⚠️` semantics in #87 (validation
  exists with a known non-blocking gap is `⚠️`; merge-blocking missing
  or failing validation is `❌`). The legend lives in the rendered
  body, not in a comment.
- R3: The `## Test coverage` section renders a one-line clarification
  of the `AC` column ("`AC` references the acceptance-criteria IDs
  from the linked issue, in `AC-<issue>-<n>` form"), so a non-author
  reviewer can interpret the column without prior context from
  `docs/ac-traceability.md`.
- R4: The `## Acceptance criteria` section opens with a one-line
  rendered orientation that names the three things each AC entry
  carries: a plain-language outcome, prose-style verification
  description, and concrete reviewer-confirm steps. The orientation
  replaces the current HTML-comment-only definition of the per-AC
  grammar.
- R5: Per-AC entries are humanized. Each `### AC-<issue>-<n>`
  heading carries the AC's human-readable title alongside its ID
  (`### AC-<issue>-<n>: <title>`) so reviewers can scan the
  acceptance-criteria section by headline rather than ID. The body
  under each AC heading uses these labeled prose blocks in this order:
  - **Outcome:** one or two sentences of plain language stating the
    current reviewer-relevant result, including any unresolved
    blockers or pending validation.
  - **Verified by:** prose sentence naming who verified, in what
    environment, with what command/workflow job/tool/harness, and an
    optional link or run identifier. The rendered template shows this
    label as a placeholder line — the existing colon-grammar
    (`<Platform> test: <command>, <environment>[, <link>]`) is
    retired.
  - **How a reviewer can confirm:** numbered or bulleted steps a
    reviewer or QA tester can follow to exercise this AC's outcome,
    plus an explicit *Expected:* line stating what they should see.
    These steps absorb the role formerly proposed for a top-level
    `## How to verify` section: there is no separate `How to verify`
    block; reviewer-confirm steps live with the AC they verify. When
    no manual confirmation is needed, the author writes
    `How a reviewer can confirm: not applicable — <one-line reason>`
    rather than omitting the slot.
  - **Open concerns:** prose listing of unresolved validation
    concerns, known gaps, or merge-blocking issues, or the literal
    word `None` when there are none. This replaces the current
    `Test gap:` checkbox grammar; concerns that block merge are
    surfaced here in prose, not as a checkbox the operator might
    miss.
  - **Before merging:** zero or more checkboxes for AC-scoped
    operator actions that must be ticked before merge readiness.
    These replace the current `Operator check:` checkbox label;
    PR-level pre-merge actions that are not AC-scoped continue to
    live in the optional `## Do before merging` section.
- R6: The `## How to verify` section is *not* added. The role it would
  have played (telling a reviewer how to exercise the change) is
  absorbed into per-AC `How a reviewer can confirm:` blocks under R5,
  scoped to the AC's outcome. This avoids a top-level recipe duplicating
  per-AC gating steps and prevents authors from maintaining the same
  instructions in two places.
- R7: The rendered template body must not bake product-surface-specific
  build-acquisition language for any surface (mobile, web, CLI,
  library, infra) into either the rendered prompts or the per-AC
  reviewer-confirm placeholders. Repo-specific examples (native build
  location, web build URL, CLI install command, library import
  snippet, infra dry-run command) live in HTML comments as
  illustrative hints. The reviewer-confirm content an author writes in
  a real PR is repo-specific by nature; the *template* stays
  product-surface-agnostic.
- R8: The template body's added rendered prose stays under a
  token-efficiency budget. Target: the diff against the current
  template adds no more than roughly 30 rendered lines (excluding
  HTML comments) for the structural rendered prompts (R1–R4), plus
  no more than roughly 15 rendered lines for the per-AC humanized
  grammar in the *placeholder* AC entry the template ships. Total
  rendered cap: ~45 lines. Expected landing zone is ~30. Each
  individual rendered prompt is one to three lines.
- R9: Root `.github/pull_request_template.md` remains byte-identical
  to the bootstrap template source at
  `skills/bootstrap/templates/core/.github/pull_request_template.md`.
  The edit lands in the template first; the root file is mirrored via
  the bootstrap skill in realignment mode in the same PR.
- R10: `docs/ac-traceability.md` is updated to reflect the humanized
  per-AC grammar (prose verification, `How a reviewer can confirm`,
  `Open concerns`, `Before merging`). The previous colon-grammar
  evidence-row form is retired and the doc must not present it as
  canonical. Updates are limited to bringing the doc in sync with the
  new template; the AC ID convention and Given/When/Then phrasing for
  issue-side ACs are unchanged.
- R11: PR authors and Superteam `Finisher` own filling the rendered
  context placeholder under `## What changed`, choosing matrix cells
  against the rendered legend, writing prose-style verification
  sentences under each AC, writing `How a reviewer can confirm` steps
  (or `not applicable — <reason>`), and listing `Open concerns` (or
  `None`). `Reviewer` and `Finisher` own flagging missing or
  placeholder values before publish-state readiness — including a
  bare `not applicable` (no reason), an unfilled `How a reviewer can
  confirm:` block, missing `Open concerns:` (must be `None` when
  empty), and matrix cells that contradict the rendered legend.
- R12: The change coordinates with #87. If #87 has not landed at merge
  time, the rendered legend in this PR uses the #87 wording and #87's
  template-side legend edit becomes a fast-follow mirror, not a
  competing rewrite. The two PRs do not land conflicting legend copy.

## Non-Goals

- Do not redesign the test-coverage matrix schema, the AC ID grammar,
  or the issue-side Given/When/Then convention. This issue is about
  rendered-body legibility, not a new schema.
- Do not adopt QA's literal section names (`Summary`, `Verification`,
  `QA findings → AC mapping`, `AC platform coverage`, `Testing
  instructions`). Their feedback is interpreted, not transcribed.
- Do not add a top-level `## How to verify` (or any equivalent name)
  to the canonical template. Reviewer-confirm steps live per-AC.
- Do not bake mobile/web/CLI/library/infra-specific build-acquisition
  copy into the canonical template body.
- Do not add automated PR-body linting for the new humanized AC
  grammar in this issue.
- Do not adopt "QA findings → AC mapping" as a canonical section. The
  underlying need (linking corrective work to the AC it satisfies) is
  served by the humanized per-AC structure.

## Acceptance Criteria

- AC-90-1: Given an author opens the PR template, when they fill the
  `## What changed` section, then the rendered template structure
  (a `Context:` line and a bullet shape that pairs each change with a
  rationale) forces linked prior context and per-bullet rationale into
  the rendered body. Detailed how-to-phrase instructions may stay in
  HTML comments per template convention; the *output* in the rendered
  body must show context and rationale, not lingering template prose.
- AC-90-2: Given a reviewer opens a rendered PR body, when they read
  the `## Test coverage` matrix, then the symbol legend
  (`✅ ❌ ⚠️ ➖`) and the meaning of the `AC` column are visible in
  the rendered body without opening the markdown source.
- AC-90-3: Given a reviewer opens a rendered PR body, when they read
  the `## Acceptance criteria` section, then the section opens with a
  rendered orientation naming the per-AC blocks (Outcome, Verified
  by, How a reviewer can confirm, Open concerns, Before merging) so
  the reader can navigate without prior context from
  `docs/ac-traceability.md`.
- AC-90-4: Given a reviewer opens a rendered PR body, when they read
  any per-AC entry, then the entry has a human-readable heading title
  (`### AC-<issue>-<n>: <title>`), prose-style "Verified by:"
  verification (not form-grammar), reviewer-friendly labels (`How a
  reviewer can confirm`, `Open concerns`, `Before merging` instead of
  `Operator check:` / `Test gap:`), and reviewer-confirm steps that
  tell a reviewer or QA tester how to exercise the AC's outcome (or
  `not applicable — <reason>` when manual confirmation is not
  needed).
- AC-90-5: Given the canonical template under
  `skills/bootstrap/templates/core/.github/pull_request_template.md`
  changes, when the bootstrap skill runs in realignment mode against
  this repo, then the root `.github/pull_request_template.md` matches
  the template byte-for-byte (round-trip parity).

## Implementation Shape

1. Edit `skills/bootstrap/templates/core/.github/pull_request_template.md`:
   - Restructure `## What changed` so the rendered template carries a
     `Context:` line and a bullet shape that pairs change with
     rationale (e.g. `- <change> — <why>`). Keep detailed instructions
     in HTML comments per template convention (R1, AC-90-1).
   - Add a rendered legend block under `## Test coverage` defining
     the four symbols with the #87-aligned wording (R2, R12, AC-90-2).
   - Add a one-line rendered clarification of the `AC` column in
     `## Test coverage` (R3, AC-90-2).
   - Add a one-line rendered orientation under `## Acceptance criteria`
     naming the per-AC labeled blocks (R4, AC-90-3).
   - Restructure the placeholder AC entry to use the humanized
     grammar: heading title appended to the AC ID; **Outcome:**,
     **Verified by:**, **How a reviewer can confirm:**, **Open
     concerns:**, **Before merging:** labeled blocks; retire the
     colon-grammar evidence row, the `Test gap:` checkbox, and the
     `Operator check:` checkbox label (R5, AC-90-4).
   - Keep the rendered additions within the R8 token-efficiency
     budget.
2. Update `docs/ac-traceability.md` to reflect the humanized per-AC
   grammar; retire references to the colon-grammar evidence row and
   to `Test gap:` / `Operator check:` labels (R10).
3. Run the bootstrap skill in realignment mode against this repo,
   accept the proposed root diff, and commit the template change and
   the mirrored root change together (R9, AC-90-5).
4. Cross-link with #87 in the PR body so the legend wording is landed
   once (R12).

## Verification

- RED-phase baseline (record before the template change lands):
  - Confirm the current rendered template body (HTML comments
    stripped) does not contain the four symbol meanings, the `AC`
    column meaning, an orientation for the AC section, AC headings
    with titles, or the **Outcome / Verified by / How a reviewer can
    confirm / Open concerns / Before merging** labels. Capture this
    as the failing baseline so the rendered fix is observable.
  - Confirm the root and template files are already byte-identical
    (`cmp -s`) so any later drift is attributable to the change.
- GREEN-phase rendered checks after the change. Each
  rendered-visibility check first strips HTML comment blocks so the
  assertion is "this string appears in the rendered body", not "this
  string appears anywhere in the file" — because the existing
  template already mentions these strings inside HTML comments and
  the failure mode this issue fixes is comment-only guidance. Use a
  portable strip such as: `sed -e '/<!--/,/-->/d'`.
  - `cmp -s skills/bootstrap/templates/core/.github/pull_request_template.md .github/pull_request_template.md`
    exits 0.
  - `grep -c '<!--' .github/pull_request_template.md` does not
    increase relative to the count needed to land the new rendered
    prompts (i.e. new author guidance is in the rendered body, not
    absorbed into HTML comments).
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'Context:'`
    matches at least once (the rendered structural placeholder for
    R1 is in the body, not only in a comment).
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F '✅'`
    matches at least once (the symbol is in the rendered body, not
    only in a comment); analogous checks for `❌`, `⚠️`, and `➖`.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'AC-'`
    matches the rendered `AC` column clarification at least once.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'Verified by:'`
    matches (the humanized verification label is rendered).
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'How a reviewer can confirm'`
    matches.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'Open concerns:'`
    matches.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -E 'Before merging:?'`
    matches the AC-scoped pre-merge label.
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F '## How to verify'`
    finds **no** match (the section was deliberately not added).
  - `sed -e '/<!--/,/-->/d' .github/pull_request_template.md | grep -F 'Operator check:'`
    finds **no** match (label retired); analogous check for
    `Test gap:`.
- Token-efficiency check: `git diff --stat` against the previous
  template shows the rendered additions stay within the R8 budget.
- Pressure test: open a sample PR body that uses the new template
  and verify a reader who has never opened
  `docs/ac-traceability.md` can answer (a) what the four symbols
  mean, (b) what `AC` columns reference, (c) what each per-AC
  block (Outcome / Verified by / How a reviewer can confirm / Open
  concerns / Before merging) is for, and (d) how to exercise the
  change for at least one AC by following its
  `How a reviewer can confirm` steps.

## Loophole Closure

The new rendered prompts and the humanized AC grammar introduce new
author/reviewer discipline. The following loopholes must be closed
explicitly so authors do not regress to invisible guidance or to the
retired form-grammar.

- Forbid moving the new rendered prompts back into HTML comments. "It
  reads cleaner with the prompt hidden" is not an acceptable
  rationale; HTML-comment-only guidance is exactly the failure mode
  this design fixes.
- Forbid replacing `How a reviewer can confirm:` with bare `N/A` or
  bare `not applicable` (no reason). The author must write
  `not applicable — <one-line reason>`. A bare placeholder is treated
  as unfilled.
- Forbid omitting `Open concerns:` from a per-AC entry. When there
  are none, the author writes `Open concerns: None`. Silent omission
  is treated as unfilled.
- Forbid reintroducing the retired colon-grammar evidence row
  (`<Platform> test: <command>, <environment>[, <link>]`) or the
  retired `Test gap:` / `Operator check:` checkbox labels in either
  the template or the consuming PRs that adopt this template. The
  humanized grammar replaces them.
- Forbid adding a top-level `## How to verify` section, or any
  equivalent name (`Testing instructions`, `Verification`, `Manual
  test plan`). Reviewer-confirm steps live per-AC under
  `How a reviewer can confirm:`. A top-level recipe duplicates
  per-AC gating and forces authors to maintain the same content in
  two places.
- Forbid baking repo-specific build-acquisition copy (native build
  location, web build URL, CLI install command, library import
  snippet, infra dry-run command) into the rendered template body.
  Such hints belong in HTML comments as illustrative examples; the
  rendered body must remain product-surface-agnostic.
- Forbid adding "QA findings → AC mapping" as a canonical section
  under the guise of "this is what reviewers asked for". The
  humanized per-AC structure already serves the underlying need.
- Forbid editing only the root `.github/pull_request_template.md`.
  Every change must land in the bootstrap template source first and
  round-trip to root in the same PR; a root-only edit silently
  regresses every bootstrapped repo on the next realignment.

## Rationalization Resistance

| Excuse | Reality |
|--------|---------|
| "The HTML comment already explains it; rendering is noise." | HTML comments are invisible to QA, GitHub mobile, and screenshot reviewers. The whole point of #90 is that comment-only guidance failed in production. |
| "I'll keep the legend in the comment because the symbols are obvious." | They were not obvious; QA literally asked what `AC` and `evidence` meant. Render the legend. |
| "I'll just add a top-level `## How to verify` because it's tidy." | A top-level recipe duplicates per-AC reviewer-confirm steps. R6 deliberately scopes "how to exercise" to the AC it verifies so authors maintain one source of truth. |
| "The colon-grammar evidence row is more compact than prose." | The grammar QA could not parse is exactly the form `iOS evidence: ...` — they asked what evidence *meant*. Prose ("Verified on iOS by Ted: ran `pnpm test:e2e` against simulator iPhone 15") trades a few characters for legibility. |
| "`Operator check:` is precise; renaming to `Before merging:` loses meaning." | "Operator" is internal jargon for the human running the workflow. Reviewers reading a PR body are operators by another name; `Before merging:` says exactly when they act and is reviewer-readable. AC-scoped pre-merge actions live there; PR-level pre-merge actions stay in the optional top-level `## Do before merging`. |
| "`Test gap:` is the canonical label." | It was. The humanized grammar replaces it with prose `Open concerns:` because gaps are not always test gaps (they may be unresolved review findings, deferred validation, or known limitations) and a prose block surfaces them where a missed checkbox does not. |
| "I'll just put the iOS / TestFlight / Vercel preview steps in the canonical template." | Repo-specific build-acquisition copy is a non-goal. Put it in the consuming repo's `How a reviewer can confirm` content, not the bootstrap template. |
| "I'll edit the root template directly and round-trip later." | Round-trip discipline exists because every bootstrapped repo regresses on the next realignment otherwise. Template-first, mirror in the same PR. |
| "QA asked for a `Verification` section; I'll add one with that exact name." | Adopt the underlying need, not the literal section name. Per-AC `How a reviewer can confirm` covers the underlying problem without colliding with QA's older naming. |
| "Per-bullet rationale will balloon `What changed`." | One rendered structural placeholder (`Context:` plus `— <why>` in the bullet shape) does not balloon anything. The R8 budget keeps rendered additions under ~45 lines combined. |
| "I'll skip `Open concerns: None` because empty means none." | Silent omission and an explicit `None` look identical to a reviewer skimming, but only the explicit `None` is a positive signal that the author thought about it. Require it. |
| "Author guidance should be rendered too so authors don't ignore it." | PR-template convention puts author instructions in HTML comments. The QA failure mode was about *what the author wrote*, not about a missing visible prompt. The fix is rendered structural placeholders the author *replaces* (`Context:` line, `— <why>` bullets, prose-labeled AC blocks), not rendered prose the reviewer must skim past on every PR. |

## Red Flags — STOP and reconsider

- You are about to land a PR-template change as `docs:` or `chore:`.
  The template is a product-surface glob (path-first rule, AGENTS.md).
  Use `feat:` or `fix:`.
- You are about to put the new author prompt, legend, AC clarification,
  AC-section orientation, or any humanized per-AC label inside
  `<!-- ... -->`. That is the failure mode this design fixes.
- You are adding a top-level `## How to verify`, `## Verification`,
  `## Testing instructions`, or `## Manual test plan` section. Stop.
  Reviewer-confirm steps live per-AC; the design deliberately avoids
  a top-level recipe.
- You are reintroducing `Operator check:`, `Test gap:`, or the
  colon-grammar evidence row. Stop. The humanized grammar replaces
  them.
- You are editing only `.github/pull_request_template.md` and leaving
  `skills/bootstrap/templates/core/.github/pull_request_template.md`
  untouched. Stop. Edit the template first, then mirror.
- You are baking iOS/TestFlight/Vercel/`npm install`/`pip install`/
  `terraform plan` copy into the rendered body of any AC's
  `How a reviewer can confirm:` placeholder. Stop. That copy is
  repo-specific; the canonical template stays
  product-surface-agnostic.
- The diff adds substantially more than the R8 budget of rendered
  lines. Stop. The fix is meant to be the smallest rendered prompts
  and grammar updates that make the body legible, not a rewrite.

## Token-Efficiency Targets

- Rendered additions across R1–R4 (structural prompts): ~30 lines or
  fewer in the rendered body (HTML comments excluded). Each
  individual rendered prompt is one to three lines.
- Rendered additions for the humanized placeholder AC entry (R5):
  ~15 lines or fewer. The five labeled blocks (Outcome / Verified by
  / How a reviewer can confirm / Open concerns / Before merging) are
  one to three lines each in the placeholder.
- Total rendered cap: ~45 lines. Expected landing zone is ~30.
- HTML-comment additions are bounded — comments may carry
  illustrative hints (e.g. example prose-style verification
  sentences, example `not applicable — <reason>` strings, example
  `Open concerns:` content) but must not balloon to replace
  contributor docs.
- The rendered template, opened on GitHub web at default zoom, should
  remain scannable in roughly two screens for a typical PR body
  (matrix on screen one; first AC entry on screen two).

## Role Ownership

- PR authors and Superteam `Finisher` own filling the rendered
  context placeholder under `## What changed`, choosing matrix cells
  against the rendered legend, writing the prose `Verified by:`
  sentence under each AC, writing `How a reviewer can confirm:`
  steps (or `not applicable — <reason>`), listing `Open concerns:`
  (or `None`), and ticking AC-scoped `Before merging:` checkboxes.
- `Reviewer` and `Finisher` own flagging missing or placeholder
  values before publish-state readiness. Specifically: a bare
  `not applicable`, an unfilled `How a reviewer can confirm:`,
  silent omission of `Open concerns:`, evidence sentences that do
  not name a verifier/environment/command, or matrix cells that
  contradict the rendered legend.
- `Brainstormer` (this artifact) owns the rendered prompts, the
  humanized grammar, and the loophole-closure language; later
  issues that refine the prompts must preserve the
  loophole-closure invariants in this design.

## Stage-Gate Bypass Resistance

- "We can land the template edit without round-tripping" — bypassed
  by R9 plus the AGENTS.md round-trip discipline; the PR must
  include both the template change and the root mirror.
- "We can keep the new section in HTML comments to avoid breaking
  consumers" — bypassed by R1, R2, R3, R4, R5, which require
  rendered visibility; HTML-comment-only versions of these prompts
  do not satisfy the ACs.
- "We can keep `Operator check:` and `Test gap:` for backwards
  compatibility" — bypassed by R5 plus the GREEN-phase grep
  asserting both labels are absent. The humanized grammar replaces
  them in the canonical template; downstream PRs adopt the new
  grammar at next template render.
- "We can drop AC-90-5 because round-trip is implied" — bypassed by
  R9 and the explicit AC-90-5 verifier; round-trip is part of every
  template change on this repo and must be observable in the PR.
- "We can re-introduce `## How to verify` later as a follow-up
  because reviewers will ask" — bypassed by R6 and the loophole
  closure forbidding the section; reviewer-confirm steps live
  per-AC. If a real cross-AC orientation need emerges, it goes in
  the AC-section orientation line (R4), not in a duplicate
  top-level recipe.

## Cross-Reference

- `docs/ac-traceability.md`: AC-ID convention and Given/When/Then
  phrasing (issue side); per-AC PR-body grammar is updated by R10
  to match the humanized template.
- `.github/pull_request_template.md`: current canonical template
  (will be mirrored from the bootstrap template source after this
  design's plan and implementation land).
- `skills/bootstrap/templates/core/.github/pull_request_template.md`:
  source of truth for the canonical template.
- Issue #87: `⚠️` semantics. Coordinate the rendered legend
  wording so #90 and #87 do not land conflicting copy.
- AGENTS.md: path-first commit-type rule (template change is a
  product-surface glob and ships as `feat:`).
