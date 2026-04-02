# Claude Code Toolchain Setup

## Purpose

This setup gives Claude Code a practical toolchain for the full workflow:

- requirements
- PRD
- design handoff
- implementation planning
- coding
- testing
- deployment

This stack assumes macOS with `zsh`.

## Recommended Stack

- `CLI-Anything`: CLI-ify internal or source-available tools that do not have mature CLIs
- `opencli`: control websites, Electron apps, and external CLIs through one hub
- `gh`: GitHub issues, PRs, projects, actions, releases
- `claude-code-figma`: import Figma context into Claude Code
- `playwright-cli`: agent-driven browser automation and smoke checks
- `vercel`: preview and production deployment for web apps
- `docker`: local containers and environment parity

## Install Order

Install these in this order:

1. Core package managers and runtime
2. GitHub CLI
3. OpenCLI
4. Playwright CLI
5. Vercel CLI
6. Docker Desktop
7. Figma bridge
8. CLI-Anything inside Claude Code

## 1. Core Runtime

Install Homebrew, Node.js 20+, and pnpm if they are not already present.

```bash
brew install node pnpm
node -v
pnpm -v
```

## 2. GitHub CLI

Use `gh` as the backbone for tickets, PRs, checks, and release coordination.

```bash
brew install gh
gh auth login
gh auth status
```

Recommended scopes:

- repo
- read:org
- workflow
- project

## 3. OpenCLI

Use `opencli` when you need a unified agent-facing CLI for websites, Electron apps, or external CLIs.

```bash
npm install -g @jackwener/opencli
opencli doctor
opencli list
```

Browser setup:

1. Download the browser bridge extension from the OpenCLI releases page.
2. Load the unpacked extension in Chrome.
3. Log into the target sites in Chrome before using site commands.

Useful checks:

```bash
opencli daemon status
opencli gh pr list --limit 5
```

## 4. Playwright CLI

Use Playwright in two modes:

- `playwright-cli` for agent-driven browser automation
- project-local Playwright Test for repeatable E2E test runs

Install the agent CLI globally:

```bash
npm install -g @playwright/cli@latest
playwright-cli --help
playwright-cli install --skills
```

For actual repo tests, keep Playwright in project dependencies and run:

```bash
npx playwright test
```

## 5. Vercel CLI

Use Vercel CLI for preview deploys, logs, env management, and production deploys.

```bash
npm install -g vercel
vercel login
vercel whoami
```

Typical release flow:

```bash
vercel
vercel inspect <deployment-url>
vercel logs <deployment-url>
vercel --prod
```

## 6. Docker Desktop

Use Docker for local services, reproducible dev environments, and CI parity.

```bash
brew install --cask docker
docker version
```

Open Docker Desktop once after install so the daemon starts correctly.

## 7. Figma Integration

Use a Claude Code compatible Figma bridge instead of trying to generate a new CLI for Figma with `CLI-Anything`.

Recommended project:

- `fakenickels/claude-code-figma`

Install it according to its repository instructions, then verify you can pull node or file context into Claude Code.

## 8. CLI-Anything In Claude Code

This is not a standard global npm CLI install. Install it inside Claude Code as a plugin.

```text
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything
```

Verify it inside a Claude Code session:

```text
/cli-anything /path/to/target
/cli-anything:list
```

Core workflow:

```text
/cli-anything /path/to/target
/cli-anything:refine /path/to/target
/cli-anything:test /path/to/target
/cli-anything:validate /path/to/target
```

Use it for:

- internal admin tools
- legacy Electron apps you control
- source-available tools without stable CLIs
- repetitive ops interfaces that agents need to drive reliably

Do not use it for:

- GitHub
- Vercel
- Docker
- Figma
- mature official CLIs

## Accounts And Access

Before expecting the full workflow to run end to end, make sure these are authenticated:

- GitHub via `gh auth status`
- Vercel via `vercel whoami`
- Chrome sessions for any `opencli` website commands
- Figma token or bridge auth, depending on the adapter you choose
- Any internal service keys stored in your shell profile or project env files

## Suggested Environment Variables

Set only what your toolchain actually uses:

```bash
export GITHUB_TOKEN=...
export FIGMA_ACCESS_TOKEN=...
export VERCEL_TOKEN=...
```

Prefer project-local `.env` files and secret managers over long-lived global shell exports when possible.

## Workflow Mapping

Use this tool for each stage:

- Requirements and PRD: Notion plus `gh` for execution tracking
- Design: Figma bridge
- Development prompts and tasking: Claude Code plus repository docs
- Coding: Claude Code, shell, project scripts, `opencli` when external tools are needed
- Testing: project test runner plus Playwright
- Deployment: Vercel
- Unsupported internal tools: CLI-Anything

## Delivery OS

Use the delivery operating system to decide which workflow to run before drafting docs or coding:

- `docs/delivery-os/README.md`
- `docs/delivery-os/mode-router.md`
- `docs/delivery-os/artifact-matrix.md`
- `docs/delivery-os/state-machine.md`
- `docs/workflows/flash-launch.md`
- `docs/workflows/product-iteration.md`
- `docs/workflows/legacy-maintenance.md`

## Standard Document Templates

Use these files as the default document starting points:

- `docs/templates/idea-brief.md`
- `docs/templates/PRD.md`
- `docs/templates/design-spec.md`
- `docs/templates/implementation-plan.md`
- `docs/templates/task-breakdown.md`
- `docs/templates/release-checklist.md`
- `docs/templates/project-profile.md`
- `docs/templates/system-map.md`
- `docs/templates/iteration-log.md`

Chinese versions:

- `docs/templates-zh/README.md`
- `docs/templates-zh/PRD.md`
- `docs/templates-zh/design-spec.md`
- `docs/templates-zh/implementation-plan.md`
- `docs/templates-zh/task-breakdown.md`
- `docs/templates-zh/release-checklist.md`

Prompt pack:

## Repo Bootstrap

For repositories that adopt this Delivery OS, add a lightweight kickoff command:

```bash
pnpm kickoff --title "Your task title" --summary "Your task summary"
```

This command should:

- route the task into one of the three modes
- generate the minimum artifact set
- give Claude Code a stable starting point before implementation

For GitHub-backed repositories, also keep labels in sync:

```bash
pnpm labels:sync -- --repo <owner/repo>
```

To bootstrap directly from a GitHub issue:

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
```

For deterministic tracking, prefer a stable workspace path such as:

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number> --out workspace/<issue-number>-<slug>
```

If the repository enables Delivery OS guardrails, adding a mode label to the issue should also trigger an automatic kickoff comment.
It can also maintain a mode-specific artifact checklist comment on the issue.
After a labeled PR is merged, it can also post an iteration-log follow-up reminder.
The PR description should also include repo-relative `Workspace` and `Artifact paths` fields.
When `Artifact paths` are present, merged PRs can also auto-check matching artifact items on the linked issue checklist.
Issue forms can also provide `Project` and `Workspace root` context to make generated workspace paths deterministic across multiple products.

- `docs/prompt-pack/README.md`
- `docs/prompt-pack/command-cheatsheet.md`
- `docs/prompt-pack/session-kickoff.md`

## First-End-To-End Dry Run

Run this sequence on a small test project:

1. Create a GitHub issue with scope and acceptance criteria.
2. Draft a PRD in Notion.
3. Pull design details from Figma or write a lightweight design note.
4. Implement the change locally.
5. Run lint, unit tests, and one browser smoke test.
6. Open a PR with `gh`.
7. Create a Vercel preview deploy.
8. Promote to production only after checks pass.

## Minimal Daily Command Set

```bash
gh issue list
gh pr status
opencli list
docker ps
vercel ls
```

Inside Claude Code:

```text
/cli-anything:list
```

## Maintenance Rules

- Prefer official vendor CLIs first.
- Keep `CLI-Anything` focused on missing interfaces, not everything.
- Keep project test runners local to the repo when possible.
- Review auth state first when an agent workflow fails unexpectedly.
- Record deploy and rollback steps in each production repo.
