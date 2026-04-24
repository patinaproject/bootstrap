# Design: Create `bootstrap` Claude skill for repo scaffolding [#1](https://github.com/patinaproject/bootstrap/issues/1)

## Intent

Ship a `bootstrap` skill — packaged as a Claude Code + Codex plugin at the repository root — that scaffolds a new public or private repository to the Patina Project file-structure baseline, and that can also audit an existing repository and recommend incremental improvements to reach the same baseline.

The enforced baseline mirrors `patinaproject/superteam`: a dual-plugin repository root, a self-contained skill directory, conventional-commits-with-issue-ref enforcement via commitlint + Husky, a PR template, `AGENTS.md` + `CLAUDE.md` guidance, a human-readable `README.md`, and a `docs/file-structure.md` contributor reference (plus the `docs/superpowers/` tree when the project adopts the superteam workflow).

## Background

Every new Patina project starts with the same setup work, and drift between repos is already visible. `superteam` has settled on a durable file structure, so `bootstrap` treats that structure as the canonical template and gives every new repo — and every retrofit — a single invocation to reach it.

## Non-goals

- Publishing to the marketplace (out of scope for this run; covered by a follow-up).
- Runtime-specific install automation beyond emitting the correct manifest files.
- Language/framework choices beyond Node.js + PNPM at the repo-tooling layer.
- Inventing a brand-new convention set: `bootstrap` emits what `superteam` already uses.

## This repo's own scaffolding

This repository must adopt the structure `bootstrap` emits, because it is the reference implementation. As part of this run, this repo gains:

- `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`
- `skills/bootstrap/SKILL.md` (+ support files as needed)
- `AGENTS.md`, `CLAUDE.md`, updated `README.md`
- `docs/file-structure.md`
- `package.json`, `pnpm-lock.yaml`, `commitlint.config.js`, `.husky/commit-msg`
- `.github/pull_request_template.md`, `.gitignore`

The `docs/superpowers/specs/` and `docs/superpowers/plans/` trees are created by this run's design + plan artifacts.

## What `bootstrap` emits into a target repo

The skill scaffolds the following tree (paths relative to the target repo root):

```text
.claude-plugin/plugin.json
.codex-plugin/plugin.json
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.husky/commit-msg
.gitignore
.editorconfig
AGENTS.md
CLAUDE.md
CONTRIBUTING.md
LICENSE            (only if missing; skill does not overwrite)
README.md
commitlint.config.js
package.json
pnpm-workspace.yaml (optional, only when user opts into a workspace)
docs/file-structure.md
skills/.gitkeep
```

### Conventions encoded

- **Commits**: Conventional Commits with no scope, required `#<issue>` tag in subject, 72-char max (lifted verbatim from `superteam/commitlint.config.js`).
- **PR titles**: same format as commits (for squash-and-merge).
- **PR body**: template mirroring `superteam/.github/pull_request_template.md`, including `Closes #<issue>` guidance and the `### AC-<issue>-<n>` acceptance-criteria block.
- **Issue titles**: plain-language, no conventional-commit prefix.
- **Issue templates**: minimal bug report + feature request.
- **Contributor docs**: `AGENTS.md` as the shared workflow contract, `CLAUDE.md` that imports `AGENTS.md` via `@AGENTS.md` and adds Claude-only guidance.
- **PNPM**: `"packageManager": "pnpm@9.15.4"` pin, `prepare: "husky"` script, commitlint devDeps, `.npmrc` with `engine-strict=true`, Node engines field.
- **Claude Code / Codex plugin surfaces**: both manifests at the repo root pointing at `./skills`.

### Placeholders

The skill prompts for (or infers) these values and templates them into emitted files:

- `<owner>`, `<repo>`, `<repo-description>`
- `<visibility>` (public | private) — affects README badges and license default
- `<primary-skill-name>` (optional; if set, scaffolds `skills/<name>/SKILL.md` starter)
- `<license>` (default MIT for public, "UNLICENSED" for private)

## Modes

### New-repo mode

Preconditions:
- Target is a git repository (initialized or empty).
- No prior `.claude-plugin/` or `.codex-plugin/` manifests.

Behavior:
- Emit the full tree above.
- Run `pnpm install` to generate `pnpm-lock.yaml` and wire Husky.
- Leave a single commit staged (not committed) so the user owns the first commit.

### Existing-repo audit mode

Preconditions:
- Target is a git repository with existing content.

Behavior:
- Inspect the repo and produce a **compliance report** grouped by baseline area: plugin manifests, skills layout, commit/PR conventions, PNPM tooling, agent docs, README/docs structure.
- For each gap, classify as `missing`, `stale`, or `divergent` and propose a concrete change.
- Never overwrite existing files without explicit confirmation. For each proposed change, show a diff preview and ask the user to accept, skip, or defer.
- Group changes into ordered batches that can be applied independently (e.g. "manifests first, then commitlint, then docs").

### Public vs. private

- **Public**: README includes install/usage sections, license badge, links to issues/discussions. License defaults to MIT.
- **Private**: README is concise and internal-focused, omits public badges, license defaults to `UNLICENSED` with a short proprietary notice.

## Skill packaging

- Lives at `skills/bootstrap/SKILL.md` in this repo.
- Repo root is the plugin surface for both Claude Code (`.claude-plugin/plugin.json`) and Codex (`.codex-plugin/plugin.json`), same pattern as `superteam`.
- Skill is invoked as `/bootstrap:bootstrap` (Claude Code) or `Use $bootstrap` (Codex).
- Support files adjacent to `SKILL.md`:
  - `templates/` — the files the skill writes into target repos (source of truth for emitted content).
  - `audit-checklist.md` — canonical compliance checklist used by audit mode.

## Acceptance criteria

- **AC-1-1** — Skill exists at `skills/bootstrap/SKILL.md` and is discoverable as a Claude Code + Codex plugin at the repo root.
- **AC-1-2** — New-repo mode scaffolds the full tree listed above into an empty target repo; `pnpm install` then `pnpm exec commitlint --help` succeeds on the result.
- **AC-1-3** — Scaffolded commit hook rejects `feat: add foo` and accepts `feat: #42 add foo`.
- **AC-1-4** — Scaffolded PR template contains the `Closes #<issue>` guidance and an `### AC-<issue>-<n>` block.
- **AC-1-5** — Existing-repo audit mode produces a grouped compliance report against a non-compliant fixture repo and proposes concrete, ordered changes without overwriting existing files by default.
- **AC-1-6** — Audit mode, when given a repo that already matches the baseline, reports zero gaps.
- **AC-1-7** — This repository itself conforms to the emitted baseline (self-hosting check): running audit mode against this repo after the run reports zero gaps.
- **AC-1-8** — `AGENTS.md`, `CLAUDE.md`, `README.md`, and `docs/file-structure.md` exist in this repo and follow the conventions documented in `superteam`.
- **AC-1-9** — Public vs. private selection produces the documented differences (README shape, license default).

## Requirement set

1. Mirror `patinaproject/superteam`'s repository structure as the enforced baseline.
2. Provide both new-repo and existing-repo audit modes in a single skill.
3. Never overwrite files in existing repos without explicit confirmation.
4. Cover: commit/issue/PR conventions, PNPM, Claude Code marketplace + skills config, `AGENTS.md` + `CLAUDE.md`, `README.md`, `docs/`.
5. Self-host: this repo must adopt the baseline it emits.
6. Distinguish public vs. private defaults.
7. Do not block on unavailable optional tooling (marketplace publish, Codex app install); emit manifests and stop.

## Open questions (for approval)

1. **Marketplace publication scope** — Issue mentions "Basic marketplace and skills configuration". Reading this as emitting the two `plugin.json` manifests and leaving actual marketplace publishing as a follow-up. Confirm?
2. **License-file generation** — Emit a `LICENSE` file only when one is missing, or always prompt? Proposal: emit only if missing.
3. **First commit ownership** — In new-repo mode, stage but do not commit, so the user's first commit reflects their authorship. Acceptable?
4. **Audit-mode UX** — Interactive confirm-per-change vs. emit a single patch file the user applies manually. Proposal: interactive, with a `--patch` flag (or equivalent argument) to emit as a patch instead.
5. **`pnpm-workspace.yaml`** — Scaffold by default, or only when user opts into a workspace? Proposal: opt-in, since most repos will be single-package.

## Concerns

- **Self-hosting chicken-and-egg**: this run must write the baseline files into *this* repo before the skill itself exists to emit them. Execution order: scaffold the repo baseline manually as part of the Executor's plan, then author the skill that encodes that same baseline as its templates. Low risk, but worth flagging.
- **Template-drift risk**: once `superteam` changes its own baseline, this repo's templates can drift. Mitigation noted as a follow-up: a sync check between `superteam`'s reference files and this repo's `templates/`. Not in scope for issue #1.
