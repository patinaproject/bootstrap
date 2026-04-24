---
name: bootstrap
description: Use when scaffolding a new public or private repository to the Patina Project baseline, or when realigning an existing repository with the current baseline. Emits conventions for commits, issues, and PRs, PNPM tooling, agent docs, and plugin surfaces for supported AI coding tools.
---

# bootstrap

`bootstrap` scaffolds a repository — new or existing — to the Patina Project baseline. The baseline mirrors [`patinaproject/superteam`](https://github.com/patinaproject/superteam): a dual-plugin repository root, a self-contained `skills/` directory, conventional-commits-with-issue-ref enforcement, a PR template, `AGENTS.md` + `CLAUDE.md`, a human-readable `README.md`, a `docs/file-structure.md` contributor reference, and PNPM + Husky + markdownlint tooling.

## Modes

The skill detects which mode to run based on target-repo state.

### New-repo mode

Preconditions:

- Target is a git repository (may be empty or just initialized).
- No prior `.claude-plugin/` or `.codex-plugin/` manifests.

Behavior:

- Emit the full [core baseline](#core-baseline) tree.
- If the user answers yes to "Is this an AI agent plugin?", additionally emit the [agent-plugin surfaces](#agent-plugin-surfaces).
- If the user answers yes to "Use the superteam workflow?", additionally emit the `docs/superpowers/specs/.gitkeep` + `docs/superpowers/plans/.gitkeep` scaffolding.
- Run `pnpm install` to generate `pnpm-lock.yaml` and wire Husky.
- Leave all emitted files staged but uncommitted so the user owns the first commit.

### Realignment mode

Preconditions:

- Target is a git repository with existing content (one or more baseline files present).

Behavior:

- Walk [`audit-checklist.md`](./audit-checklist.md) against the target repo.
- Classify each baseline item as `missing`, `stale`, or `divergent`.
- For each gap, produce a concrete recommendation on how to realign with the current baseline.
- Detect whether the repo is an AI agent plugin (by presence of any agent-plugin manifest). When detected, additionally recommend any currently-supported AI platform surface that is missing.
- For each recommendation, show a diff preview and ask the user to accept, skip, or defer. **Never overwrite existing files without explicit confirmation.** There are no flags or escape hatches; realignment is always interactive.
- Group recommendations into ordered batches that can be applied independently: manifests → commit/PR conventions → PNPM tooling → agent docs → docs/README → AI platform surfaces.

## Prompts

The skill collects the following inputs. Author name, author email, and the security contact are derived from `git config user.name` and `git config user.email`; halt with a blocker if those are unset.

| Prompt | Default | Notes |
|---|---|---|
| `<owner>` | from `git remote get-url origin` | GitHub org or user |
| `<repo>` | from `git remote get-url origin` | repository name |
| `<repo-description>` | — | one-line description |
| `<visibility>` | public | public \| private |
| `<is-agent-plugin>` | no | yes emits plugin/config surfaces for every supported AI coding tool |
| `<use-superteam>` | no | yes emits `docs/superpowers/` skeleton |
| `<primary-skill-name>` | — | optional; scaffolds `skills/<name>/SKILL.md` starter |
| `<codeowner>` | `@<owner>` | written into `.github/CODEOWNERS` |
| `<security-contact>` | from `git config user.email` | public repos only; written into `SECURITY.md` |
| `<author-name>` | from `git config user.name` | written into `package.json` |
| `<author-email>` | from `git config user.email` | written into `package.json` |
| Continue.dev | no | opt-in secondary editor surface during agent-plugin mode |

## Core baseline

Emitted for every target repo:

```text
.claude/settings.json
.editorconfig
.github/CODEOWNERS
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/pull_request_template.md
.github/workflows/lint-pr.yml
.gitattributes
.gitignore
.husky/commit-msg
.husky/pre-commit
.markdownlint.jsonc
.markdownlintignore
.nvmrc
AGENTS.md
CHANGELOG.md
CLAUDE.md
CONTRIBUTING.md
README.md
RELEASING.md
SECURITY.md                 (public repos only)
commitlint.config.js
docs/file-structure.md
package.json
scripts/check-plugin-versions.mjs
scripts/sync-plugin-versions.mjs
```

## Agent plugin surfaces

Emitted only when `<is-agent-plugin>` is yes:

```text
.claude-plugin/plugin.json          (Claude Code)
.codex-plugin/plugin.json           (Codex)
.opencode/README.md                 (Opencode presence marker; reads AGENTS.md)
.github/copilot-instructions.md     (GitHub Copilot)
.github/workflows/release.yml       (release-please)
.cursor/rules/patina.mdc            (Cursor)
.windsurfrules                      (Windsurf)
release-please-config.json
.release-please-manifest.json
skills/.gitkeep
```

Aider, Zed, Cline, and Codex CLI read `AGENTS.md` natively and are covered by the core baseline. Continue.dev is available as an opt-in secondary editor (`.continue/config.json`).

## Plugin enablement

The emitted `.claude/settings.json` enables the canonical Patina plugins at the project level:

```jsonc
{
  "enabledPlugins": {
    "superteam@patinaproject": true,
    "superpowers@claude-plugins-official": true
  }
}
```

The skill does not recommend running any commands postinstall. Plugin enablement is declarative in the emitted settings; nothing else is printed or documented as a required follow-up.

## Conventions encoded

- **Commits**: Conventional Commits with no scope, required `#<issue>` tag, 72-char max. Enforced by commitlint + husky `commit-msg`.
- **PR titles**: same format, so squash commits reuse them verbatim.
- **PR body**: `Closes #<issue>` guidance and `### AC-<issue>-<n>` block.
- **Issue titles**: plain-language, no commit-style prefix.
- **Markdown**: `markdownlint-cli2` with `.markdownlint.jsonc` + `.markdownlintignore`. `lint-staged` runs it from `pre-commit`. The lint script uses a glob that excludes `node_modules/`.
- **PNPM**: `"packageManager": "pnpm@9.15.4"` pin, `engines.node >=20`, `prepare: "husky"`, `lint:md` script.
- **Line endings**: `.gitattributes` with `* text=auto eol=lf`.
- **PR title hygiene**: `.github/workflows/lint-pr.yml` validates that every PR title is ASCII-only, follows conventional commits (no scopes), starts with a `#<issue>` ref, keeps breaking-change markers consistent (`!` in title ⇔ `BREAKING CHANGE:` footer), and that the body contains a GitHub closing keyword.
- **Releases (agent-plugin mode)**: [`release-please`](https://github.com/googleapis/release-please) reads conventional commits since the last tag, opens a standing release PR that bumps `package.json` + both plugin manifests + `CHANGELOG.md`, and publishes a GitHub Release on merge. Semver level is derived from commit types; there is no manual patch/minor/major choice.
- **Distribution via `patinaproject/skills` (agent-plugin mode, auto-detected)**: when the repo owner is `patinaproject`, the emitted release workflow also dispatches `bump-plugin-tags.yml` on `patinaproject/skills` immediately after a release, so the marketplace surfaces the new tag without manual steps. Forks outside the org skip the step automatically. Requires a one-time org-level `PATINA_SKILLS_DISPATCH_TOKEN` secret on `patinaproject` (documented in the emitted `RELEASING.md`).
- **Version canonicalization**: `package.json` is the single source of truth for the plugin version. `scripts/sync-plugin-versions.mjs` rewrites `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` to match; `scripts/check-plugin-versions.mjs` enforces the lockstep via husky `pre-commit`.

## Verification self-test

After a scaffold or realignment run on this repo, all of the following must succeed:

```bash
pnpm install
pnpm exec commitlint --help
pnpm lint:md
echo "feat: bad" | pnpm exec commitlint   # exits non-zero
echo "feat: #1 ok" | pnpm exec commitlint # exits zero
```

Run `pnpm exec markdownlint-cli2 --fix "**/*.md" "#node_modules"` to auto-fix common markdown violations before committing.

## Reference implementation

This repository — [`patinaproject/bootstrap`](https://github.com/patinaproject/bootstrap) — is the canonical reference for every file this skill emits. The `templates/` directory under `skills/bootstrap/` mirrors these files with placeholders.

## Related documents

- [`audit-checklist.md`](./audit-checklist.md) — canonical realignment checklist.
- [`templates/`](./templates/) — template files emitted into target repos.
- [`../../AGENTS.md`](../../AGENTS.md) — repo workflow contract.
- [`../../docs/file-structure.md`](../../docs/file-structure.md) — layout reference.
