# bootstrap

Scaffold new projects ready for structured commits, issues, and pull requests — and realign existing repos to the latest Patina Project baseline.

`bootstrap` is a Claude Code + Codex plugin that emits the Patina repository baseline into a new or existing repository. For new repos it scaffolds the full tree. For existing repos it runs a non-destructive realignment pass that recommends concrete changes before applying them.

## What it enforces

The baseline mirrors [`patinaproject/superteam`](https://github.com/patinaproject/superteam):

- **Conventions**: Conventional Commits with a required `#<issue>` tag, matching PR titles, GitHub issue templates, PR template with `Closes #<issue>` and `AC-<issue>-<n>` sections.
- **Tooling**: PNPM with `packageManager` pin, Husky `commit-msg` + `pre-commit` hooks, commitlint, `markdownlint-cli2` + `lint-staged`, `.editorconfig`, `.gitattributes`, `.nvmrc`.
- **Agent docs**: `AGENTS.md` as the portable workflow contract, `CLAUDE.md` that imports it, `CONTRIBUTING.md`, `SECURITY.md` (public repos).
- **Claude Code**: `.claude/settings.json` with `enabledPlugins` for the Patina marketplace, plus a repo-level README note about the one-time `/plugin marketplace add patinaproject/skills` prerequisite.
- **Docs**: `docs/file-structure.md` as the contributor layout reference; optional `docs/superpowers/` skeleton for issue-driven workflows.

## AI agent plugin mode

When the repo is itself an AI agent plugin, `bootstrap` also emits plugin/config surfaces for every currently-supported AI coding tool:

- Claude Code (`.claude-plugin/plugin.json`)
- Codex (`.codex-plugin/plugin.json`)
- Opencode (`.opencode/`)
- GitHub Copilot (`.github/copilot-instructions.md`)
- Cursor (`.cursor/rules/patina.mdc`)
- Windsurf (`.windsurfrules`)

Aider, Zed, and Cline read `AGENTS.md` natively, so they are covered by the core baseline without dedicated rule files. Continue.dev support is available as an opt-in prompt.

Re-running `bootstrap` on an existing agent plugin realigns it with the current supported-platform set, recommending any newly supported platform that is missing.

## Install

First-time marketplace registration on a new machine:

```text
/plugin marketplace add patinaproject/skills
```

The plugins this repo depends on (`superteam@patinaproject`, `superpowers@patinaproject`) are already declared in `.claude/settings.json`, so they are enabled automatically once the marketplace is registered.

## Usage

From a GitHub issue in your Claude Code session:

```text
/bootstrap:bootstrap
```

From Codex:

```text
Use $bootstrap to scaffold or realign this repository.
```

The skill prompts for:

- owner, repo, description, visibility (public | private)
- whether this is an AI agent plugin
- whether to scaffold the `docs/superpowers/` skeleton
- optional secondary editors (Continue.dev)

Author name, author email, and the security contact are derived from `git config user.name` and `git config user.email`.

## New-repo vs. realignment

- **New repo**: scaffolds the full baseline; stages files and leaves the first commit to you.
- **Existing repo**: classifies gaps as `missing`, `stale`, or `divergent`; shows a diff preview for each recommendation; never overwrites without explicit confirmation. Realignment is always interactive.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`AGENTS.md`](./AGENTS.md).
