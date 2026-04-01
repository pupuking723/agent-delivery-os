# Claude Code Workflow

## Goal

Use Claude Code as the orchestration layer for the full delivery workflow:

1. Clarify requirements
2. Draft PRD
3. Extract design context
4. Generate implementation prompts and task breakdown
5. Implement changes
6. Run tests and validation
7. Prepare release and deploy

## Default Tool Stack

- Requirements and PRD: Notion
- Task tracking: GitHub Issues and GitHub Projects via `gh`
- Design handoff: Figma via `claude-code-figma`
- Development: Claude Code, local shell, `opencli`, `docker`
- Browser automation and E2E validation: `playwright-cli` plus project-local Playwright tests
- Deployment: `vercel`
- Internal tools without good CLIs: `CLI-Anything`

## When To Use Each Tool

- Use `gh` for issues, PRs, labels, project automation, workflow runs, and release coordination.
- Use `opencli` when a website, Electron app, or an existing external CLI must be controlled from a unified interface.
- Use `CLI-Anything` only when the target system does not already have a mature official CLI and source code is available.
- Use `claude-code-figma` to pull structure, copy, components, spacing, and implementation hints from Figma.
- Use `playwright-cli` for agent-driven browser interactions and smoke checks.
- Use project-local Playwright tests via `npx playwright test` for repeatable CI-grade E2E validation.
- Use `vercel` for preview deploys, production deploys, logs, env checks, and rollback operations.

## Delivery Workflow

## Mode Routing

Before planning or coding, classify the task into one mode:

- `Flash Launch`
  for 0-to-1 speed-focused launches
- `Product Iteration`
  for improving an already-live product
- `Legacy Maintenance`
  for existing, unclear, or vibe-coded systems that need safe evolution

Routing rules:

- If context is incomplete, code is legacy, or the user describes a handoff or vibe coding project, choose `Legacy Maintenance`
- If the product is not live and speed-to-market is the primary goal, choose `Flash Launch`
- If the product is already live and the goal is feature growth or optimization, choose `Product Iteration`
- If ambiguous, choose the higher-risk mode

Reference:

- `docs/delivery-os/mode-router.md`
- `docs/delivery-os/artifact-matrix.md`
- `docs/delivery-os/state-machine.md`
- `scripts/delivery-os/init.mjs`

### 1. Requirements Intake

- Read the source request, linked docs, and any relevant tickets.
- Produce a concise problem statement, user goals, constraints, and acceptance criteria.
- If the request is underspecified, list assumptions before implementation.

### 2. PRD Draft

Create or update a PRD with:

- Problem
- Target users
- Scope
- Non-goals
- Functional requirements
- Edge cases
- Acceptance criteria
- Release risks

Recommended system of record: Notion.

Suggested template: `docs/templates/PRD.md`
Fast-mode starter: `docs/templates/idea-brief.md`

### 3. Design Intake

- Pull design context from Figma when a file or node is provided.
- Extract components, states, copy, spacing, interactions, responsive behavior, and assets.
- If no design exists, derive a lightweight implementation spec from the PRD and existing product patterns.

Suggested template: `docs/templates/design-spec.md`

### 4. Implementation Planning

Before coding:

- Break work into tasks small enough to review safely.
- Identify touched files and dependencies.
- Identify tests that must pass.
- Identify deploy or migration implications.

Suggested template: `docs/templates/implementation-plan.md`
Suggested execution tracker: `docs/templates/task-breakdown.md`
Chinese templates: `docs/templates-zh/`
Project context templates:

- `docs/templates/project-profile.md`
- `docs/templates/system-map.md`
- `docs/templates/iteration-log.md`

### 5. Implementation

- Prefer minimal changes that satisfy the acceptance criteria cleanly.
- Preserve existing architecture and style unless the change requires a refactor.
- Document any important assumptions in the PR body or release notes.

### 6. Validation

Run the smallest reliable validation set first, then broaden if needed:

- Lint
- Unit tests
- Integration tests
- Browser smoke checks with `playwright-cli`
- CI-grade E2E validation with `npx playwright test`
- Manual checks for critical paths

If validation is incomplete, explicitly state what was not run and why.

### 7. Release

For deployable changes:

- Open or update the PR
- Summarize impact, test evidence, and risks
- Deploy preview when applicable
- Deploy production when approved
- Verify logs, health, and rollback path

Suggested template: `docs/templates/release-checklist.md`

### 8. Learn

After release, capture:

- what changed
- what happened after release
- which signals improved or worsened
- what should be done next

Suggested template: `docs/templates/iteration-log.md`

## Required Outputs Per Task

For each non-trivial request, produce:

- A short summary of the change
- Files touched
- Validation run
- Open risks or follow-ups

For product work, also produce:

- Requirement summary
- PRD link or PRD section
- Design notes or Figma extraction summary
- Implementation plan
- Release checklist for deployable changes
- Reuse prompts from `docs/prompt-pack/` when applicable
- Update `iteration-log` after deployable changes

## CLI-Anything Policy

Use `CLI-Anything` for:

- Internal admin systems
- Legacy desktop tools
- Open-source tools with source access but poor agent ergonomics
- Repetitive operator workflows that need deterministic CLI entrypoints

Do not use `CLI-Anything` for:

- GitHub, use `gh`
- Vercel, use `vercel`
- Cloudflare deployments, use `wrangler`
- Figma design extraction, use `claude-code-figma`
- Tools that already have stable official CLIs or MCP integrations

## Suggested Command Flow

Requirements and planning:

```bash
gh issue view <id>
gh project item-list <project-id>
```

Design intake:

```bash
claude-code-figma import <figma-url>
```

Implementation and validation:

```bash
pnpm test
pnpm lint
npx playwright test
```

Release:

```bash
gh pr create
gh pr checks
vercel
vercel --prod
```

CLI-Anything harness generation:

```bash
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything
/cli-anything /path/to/target
/cli-anything:refine /path/to/target
/cli-anything:test /path/to/target
/cli-anything:validate /path/to/target
```

## Decision Rules

- Prefer official CLIs over generated CLIs.
- Prefer local project scripts over global tool defaults when both exist.
- Prefer deterministic commands over browser automation when both can solve the task.
- Do not deploy without a clear validation summary.
- Do not create a new workflow system if the repository already has one.
- Do not start implementation before mode routing and minimum artifact selection are complete.
- If this repository exposes a kickoff script, prefer using it to generate the minimum artifact pack before manual drafting.
