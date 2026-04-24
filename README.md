# bootstrap

Scaffold a new repository — or realign an existing one — to the Patina Project baseline. One invocation, consistent conventions, portable across every major AI coding tool.

`bootstrap` is a Claude Code + Codex plugin distributed through the `patinaproject/skills` marketplace. It ships as a single skill at `skills/bootstrap/SKILL.md` plus a set of templates under `skills/bootstrap/templates/`. The skill walks the target repository against [`audit-checklist.md`](./skills/bootstrap/audit-checklist.md) and emits (or recommends) the files required to reach the baseline.

## What it enforces

### Core baseline (every repo)

- **Conventional Commits** with no scope and a required `#<issue>` tag, enforced locally by husky + commitlint (`commit-msg`) and in CI by `lint-pr.yml`.
- **PR title hygiene**: ASCII-only, conventional format, `#<issue>` subject, breaking-change marker consistency (`!` in title ⇔ `BREAKING CHANGE:` footer), and a `Closes #<issue>` keyword in the body.
- **Markdown linting** via `markdownlint-cli2` with `.markdownlint.jsonc` and `.markdownlintignore`. Runs locally on staged `*.md` through husky `pre-commit` + `lint-staged`; runs in CI via `lint-md.yml`.
- **Workflow linting** via `actionlint` (`lint-actions.yml` + `.github/actionlint.yaml`) so every push through `.github/workflows/**` is checked for syntax, expression errors, and shellcheck issues.
- **GitHub Actions SHA pinning** — every `uses:` references a full 40-char commit SHA with a `# <action>@<version>` comment above it, documented in `AGENTS.md`.
- **PNPM toolchain**: `packageManager: pnpm@10.33.2`, `engines.node >=24`, `.nvmrc`, `.gitattributes` with LF line endings, `.editorconfig`.
- **Agent + repo docs**: `AGENTS.md` (shared workflow contract), `CLAUDE.md` (Claude-specific additions), `CONTRIBUTING.md`, `SECURITY.md` for public repos, `README.md`, and a contributor-facing `docs/file-structure.md`.
- **Claude Code project settings**: `.claude/settings.json` with `enabledPlugins` declaring the Patina marketplace plugins at the project level, no post-install commands required.
- **CODEOWNERS + issue/PR templates** under `.github/` wired into GitHub's automatic discovery.

### AI agent plugin add-ons (when the repo is itself a plugin)

Emitted when the skill detects or is told the repo is an agent plugin. Surfaces every AI coding tool with a real plugin/extension model:

- **Claude Code** — `.claude-plugin/plugin.json`
- **Codex** — `.codex-plugin/plugin.json` (CLI + App, same manifest shape)
- **GitHub Copilot** — `.github/copilot-instructions.md`
- **Cursor** — `.cursor/rules/<repo>.mdc`
- **Windsurf** — `.windsurfrules`

Aider, Zed, Cline, Codex CLI, and Opencode read `AGENTS.md` natively and are covered by the core baseline with no dedicated surface. Continue.dev is available as an opt-in secondary editor via `.continue/config.json`.

### Release flow

For agent plugins, bootstrap wires a complete [release-please](https://github.com/googleapis/release-please)-driven flow:

- `.github/workflows/release.yml` opens a standing release PR based on conventional commits. Merging the PR tags `vX.Y.Z` and publishes a GitHub Release with auto-generated notes.
- Semver level is derived from commit types (`fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE:` → major). No manual choice.
- `release-please-config.json` keeps `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` in lockstep with `package.json` (`extra-files` + `$.version`).
- `scripts/sync-plugin-versions.mjs` and `scripts/check-plugin-versions.mjs` enforce the same lockstep locally; husky `pre-commit` blocks drift.
- `CHANGELOG.md` is release-please-owned; `RELEASING.md` documents the flow.

### Patina organization supplement

When the target repo's owner is `patinaproject`, bootstrap emits a supplemental `release.yml` (from `templates/patinaproject-supplement/`) that additionally dispatches `bump-plugin-tags.yml` on `patinaproject/skills` after each successful release. Forks outside the org get the clean generic workflow. A one-time org-level `PATINA_SKILLS_DISPATCH_TOKEN` secret is the only prerequisite.

### GitHub repository settings

Bootstrap does not modify server-side settings — they have no committed-file representation. Instead, the skill checks current settings (via `gh api` when installed, `curl` for public repos, or visual inspection otherwise) and walks the user through the UI with a deep-link to `settings#pull-requests-heading`. See [SKILL.md](./skills/bootstrap/SKILL.md#github-repository-settings) for the full matrix of recommended merge and release settings.

## Modes

### New repo

Preconditions: target is a git repository (may be empty). No prior `.claude-plugin/` or `.codex-plugin/`.

Behavior: scaffold the full baseline (core + optional agent-plugin surfaces + optional `docs/superpowers/` skeleton), run `pnpm install`, leave changes staged. The user owns the first commit.

### Realignment

Preconditions: target is a git repository with existing content.

Behavior: walk `audit-checklist.md` against the repo, classify each item as `missing`, `stale`, or `divergent`, and produce concrete recommendations grouped into ordered batches (manifests → conventions → PNPM tooling → agent docs → docs/README → AI platform surfaces → release flow → repo settings). Every recommendation is shown as a diff preview and requires explicit user confirmation — no flags, no silent overwrites. Re-running against an existing agent plugin also surfaces any newly-supported AI platform that is missing, so plugins stay aligned with the latest supported set.

## Supported AI coding tools

| Tool | Surface | How it's covered |
|---|---|---|
| Claude Code | `.claude-plugin/plugin.json` | Full plugin manifest |
| Codex (CLI + App) | `.codex-plugin/plugin.json` | Full plugin manifest with UI metadata |
| GitHub Copilot | `.github/copilot-instructions.md` | Repo-level instructions |
| Cursor | `.cursor/rules/<repo>.mdc` | Always-applied rule with frontmatter |
| Windsurf | `.windsurfrules` | Repo-level rule file |
| Aider | `AGENTS.md` | Native support |
| Zed | `AGENTS.md` | Native support |
| Cline | `AGENTS.md` | Native support |
| Codex CLI | `AGENTS.md` | Native support |
| Opencode | `AGENTS.md` | Native support |
| Continue.dev | `.continue/config.json` | Opt-in |

## Usage

From a GitHub issue in a Claude Code session:

```text
/bootstrap:bootstrap
```

From Codex:

```text
Use $bootstrap to scaffold or realign this repository.
```

The skill prompts for:

- `<owner>`, `<repo>`, `<repo-description>`
- `<visibility>` — public or private
- `<is-agent-plugin>` — yes emits the plugin manifests + Cursor/Windsurf/Copilot surfaces
- `<use-superteam>` — yes emits the `docs/superpowers/` skeleton
- Continue.dev — opt-in secondary editor

Author name, author email, and `SECURITY.md` contact default from `git config user.name` and `git config user.email`.

## Installation

Bootstrap is distributed through the `patinaproject/skills` Claude Code marketplace and the equivalent Codex marketplace. Installing follows the standard marketplace + plugin-enable flow for each tool. See the Patina marketplace README for current install commands.

## Development

This repository is its own reference implementation — every file `bootstrap` emits is present here under either the repo root or `skills/bootstrap/templates/`. That's the self-hosting check: realignment mode run against this repo must report zero gaps.

Local workflow:

```bash
pnpm install           # installs dev deps and wires husky
pnpm lint:md           # markdownlint-cli2
pnpm check:versions    # enforce package.json ↔ plugin manifests lockstep
pnpm commitlint        # one-off commit-message validation
```

Commits and PR titles follow the enforced convention: `type: #<issue> short description`.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`AGENTS.md`](./AGENTS.md). The release flow is documented in [`RELEASING.md`](./RELEASING.md).

## Related

- [`skills/bootstrap/SKILL.md`](./skills/bootstrap/SKILL.md) — the skill contract, modes, placeholders, and emitted tree.
- [`skills/bootstrap/audit-checklist.md`](./skills/bootstrap/audit-checklist.md) — canonical realignment checklist.
- [`docs/file-structure.md`](./docs/file-structure.md) — repository layout reference.
- [`patinaproject/superteam`](https://github.com/patinaproject/superteam) — the sibling plugin whose file layout bootstrap enforces.
- [`patinaproject/skills`](https://github.com/patinaproject/skills) — the marketplace that distributes bootstrap and other Patina plugins.
