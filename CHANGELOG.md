# Changelog

## v0.3.0 - 2026-04-03

CLI and plugin architecture update for `agent-delivery-os`.

### Included

- `packages/core` for shared workflow logic
- `packages/cli` for a reusable `delivery-os` command surface
- backward-compatible top-level script wrappers
- repo-local Claude Code plugin scaffold under `plugins/delivery-os`
- plugin marketplace manifest under `.agents/plugins/marketplace.json`
- plugin usage guide and CLI/plugin architecture documentation

## v0.2.1 - 2026-04-03

Usability and onboarding update for `agent-delivery-os`.

### Included

- beginner-friendly `docs/quickstart.md`
- beginner-friendly `docs/quickstart.en.md`
- README simplification around 3 primary commands
- `health:check` alias to avoid confusion with pnpm's built-in `doctor` command
- doctor validation updated to include `health:check`

## v0.2.0 - 2026-04-03

Bootstrap and repository verification update for `agent-delivery-os`.

### Included

- `bootstrap:repo` for business repo local project scaffolding
- `bootstrap:github` for repository metadata and label setup
- `bootstrap:all` to combine local and GitHub initialization in one command
- `doctor` command for local and optional remote repository health checks
- template repository guide updates for the new bootstrap flow
- package version aligned with the latest release line

## v0.1.1 - 2026-04-03

Public packaging and repository health update for `agent-delivery-os`.

### Included

- polished Chinese and English README landing sections
- release and license badges
- clearer quick-start and playbook/demo entry points
- `SECURITY.md`
- `SUPPORT.md`
- `CODE_OF_CONDUCT.md`
- repository homepage set to the playbook
- repository topics added for discoverability

## v0.1.0 - 2026-04-02

First public release of `agent-delivery-os`.

### Included

- three delivery modes:
  - `Flash Launch`
  - `Product Iteration`
  - `Legacy Maintenance`
- mode routing, artifact matrix, and state machine
- English and Chinese templates
- prompt pack for Claude Code execution
- issue-driven workspace generation
- deterministic workspace paths
- GitHub labels sync
- issue kickoff comments
- issue artifact checklist comments
- PR guardrails
- merge-time checklist updates
- merge-time `iteration-log` reminders
- end-to-end playbook
- demo product iteration flow pack
- MIT license
- English README
