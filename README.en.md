# Delivery OS

[![Release](https://img.shields.io/github/v/release/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/releases/latest)
[![License](https://img.shields.io/github/license/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/blob/main/LICENSE)

[中文说明](./README.md)

> Agent-first delivery operating system for repeatable product execution.

An agent-oriented delivery operating system for turning:

`idea -> spec -> implementation -> validation -> release -> feedback`

into a repeatable, collaborative repository workflow.

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

## Why This Repo

- it is not just a template set, but a delivery repo with built-in GitHub automation
- it covers not only planning, but also validation, release follow-up, and iteration logging
- it can be used directly as a master repo and then adapted into real product repositories

## At A Glance

- modes: `Flash Launch` / `Product Iteration` / `Legacy Maintenance`
- automation: issue labels, kickoff comments, artifact checklists, PR guardrails, merge follow-up
- assets: English and Chinese templates, prompt pack, playbook, demo flow pack
- output: deterministic workspaces, traceable artifacts, and iteration-log reminders

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
3. If this is a fresh business repo, bootstrap project context first
4. Generate a workspace

```bash
pnpm bootstrap:all -- --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>
```

```bash
pnpm bootstrap:repo -- --project "New Product" --repo-name "new-product-repo" --workspace-root "workspace"
```

```bash
pnpm bootstrap:github -- --repo <owner/repo> --project "New Product"
```

```bash
pnpm doctor -- --repo <owner/repo>
```

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

Check repository health:

```bash
pnpm doctor -- --repo <owner/repo>
```

If you want to see a full working example first, start here:

- [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)
- [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)

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
- template repository guide:
  [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)
- collaboration defaults:
  [docs/repo/collaboration-defaults.md](/Users/mac/Desktop/other/全栈/docs/repo/collaboration-defaults.md)
- end-to-end playbook:
  [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- product iteration demo pack:
  [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)
- security disclosure:
  [SECURITY.md](/Users/mac/Desktop/other/全栈/SECURITY.md)
- support path:
  [SUPPORT.md](/Users/mac/Desktop/other/全栈/SUPPORT.md)
- code of conduct:
  [CODE_OF_CONDUCT.md](/Users/mac/Desktop/other/全栈/CODE_OF_CONDUCT.md)

## License

This repository is licensed under the [MIT License](/Users/mac/Desktop/other/全栈/LICENSE).
