# Delivery OS

An agent-oriented delivery operating system for turning:

`idea -> spec -> implementation -> validation -> release -> feedback`

into a repeatable workflow.

[中文说明](./README.md)

> Agent-first delivery operating system for repeatable product execution.

Built for three common scenarios:

- launching a new idea quickly
- iterating on a live product
- safely maintaining legacy or vibe-coded systems

This repository already ships with:

- three-mode routing
- issue-to-workspace automation
- PR guardrails
- post-merge follow-up reminders
- example workspaces and demo flow packs

## What It Solves

- `Flash Launch`
  move from 0 to 1 and ship quickly
- `Product Iteration`
  keep improving a live product
- `Legacy Maintenance`
  safely evolve legacy or vibe-coded systems

## Repository Layout

- `CLAUDE.md`
  execution rules for Claude Code
- `docs/delivery-os/`
  mode routing, artifact matrix, and state machine
- `docs/workflows/`
  workflow definitions for the three modes
- `docs/templates/`
  English templates
- `docs/templates-zh/`
  Chinese templates
- `docs/prompt-pack/`
  prompt pack for execution
- `scripts/delivery-os/init.mjs`
  generates the minimum artifact pack from a task description
- `scripts/delivery-os/from-issue.mjs`
  generates a workspace directly from a GitHub issue
- `scripts/github/sync-labels.mjs`
  syncs repository labels to GitHub
- `examples/`
  example workspaces and demo flow packs

## Quick Start

1. Read [docs/delivery-os/README.md](/Users/mac/Desktop/other/全栈/docs/delivery-os/README.md)
2. Read [CLAUDE.md](/Users/mac/Desktop/other/全栈/CLAUDE.md)
3. Generate a workspace

```bash
pnpm kickoff --title "Team invite flow" --summary "A live product needs role assignment and release checks"
```

Generate directly from a GitHub issue:

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
```

Sync labels:

```bash
pnpm labels:sync -- --repo <owner/repo>
```

## Built-in Automation

This repository already includes:

- issue templates with mode labels
- automatic kickoff comments
- automatic artifact checklist comments
- deterministic workspace paths
- PR guardrails
- merge-time iteration-log reminders
- automatic checklist updates from merged `Artifact paths`

## Recommended Entry Points

- setup and repository wiring:
  [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)
- collaboration defaults:
  [docs/repo/collaboration-defaults.md](/Users/mac/Desktop/other/全栈/docs/repo/collaboration-defaults.md)
- end-to-end playbook:
  [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- product iteration demo pack:
  [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)

## License

This repository is licensed under the [MIT License](/Users/mac/Desktop/other/全栈/LICENSE).
