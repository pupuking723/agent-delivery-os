# Delivery OS

[![Release](https://img.shields.io/github/v/release/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/releases/latest)
[![License](https://img.shields.io/github/license/pupuking723/agent-delivery-os)](https://github.com/pupuking723/agent-delivery-os/blob/main/LICENSE)

[中文说明](./README.md)

> Agent-first delivery operating system for repeatable product execution.

An agent-oriented delivery operating system for turning:

`idea -> spec -> implementation -> validation -> release -> feedback`

into a repeatable, collaborative repository workflow.

The original goal is not to replace everything with one giant CLI.
It is to orchestrate open-source projects, official CLIs, websites, and desktop tools through one agent-friendly workflow so people can build useful products, automations, and experiments faster.

This repository now exposes two entry layers:

- `delivery-os CLI`
- `Claude Code plugin`

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

## Start With These 5 Entry Points

```bash
pnpm guide
pnpm start:flow --title "Workflow title" --summary "What you want to build"
pnpm bootstrap:all -- --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>
pnpm kickoff --title "Feature title" --summary "Feature summary"
pnpm health:check -- --repo <owner/repo>
```

If you are not sure about the order, run:

```bash
pnpm guide
```

It prints the exact terminal-first sequence: initialize the repository, create a workspace for a request, then run validation.

If you want the lowest-friction entrypoint, run:

```bash
pnpm start:flow --title "Workflow title" --summary "What you want to build"
```

If this is your first time here, start with [docs/quickstart.en.md](/Users/mac/Desktop/other/全栈/docs/quickstart.en.md).

If you want the Claude Code plugin path, see [docs/plugin.md](/Users/mac/Desktop/other/全栈/docs/plugin.md).

## Why This Repo

- it is not just a template set, but a delivery repo with built-in GitHub automation
- it covers not only planning, but also validation, release follow-up, and iteration logging
- it can be used directly as a master repo and then adapted into real product repositories
- it focuses on orchestrating existing capabilities instead of rebuilding them:
  official CLI first, then `opencli`, then `CLI-Anything`

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

- `packages/core/`
  shared delivery logic
- `packages/cli/`
  `delivery-os` CLI entrypoint
- `plugins/delivery-os/`
  Claude Code plugin entrypoint
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

If you are new to this repository, this is enough:

```bash
pnpm guide
```

```bash
pnpm bootstrap:all -- --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>
```

```bash
pnpm kickoff --title "Team invite flow" --summary "A live product needs role assignment and release checks"
```

```bash
pnpm health:check -- --repo <owner/repo>
```

If you want to see a full working example first, start here:

- [docs/quickstart.en.md](/Users/mac/Desktop/other/全栈/docs/quickstart.en.md)
- [docs/recipes/README.md](/Users/mac/Desktop/other/delivery-os/docs/recipes/README.md)
- [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)
- [examples/workspace-interface-automation/README.md](/Users/mac/Desktop/other/delivery-os/examples/workspace-interface-automation/README.md)
- [examples/demo-product-iteration/README.md](/Users/mac/Desktop/other/全栈/examples/demo-product-iteration/README.md)
- [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)

If you already know the interface path, you can scaffold directly:

```bash
pnpm recipes opencli --title "Workflow title"
```

## Advanced Commands

- local business repo scaffold only:
  `pnpm bootstrap:repo -- --project "New Product" --repo-name "new-product-repo" --workspace-root "workspace"`
- GitHub metadata only:
  `pnpm bootstrap:github -- --repo <owner/repo> --project "New Product"`
- workspace from a GitHub issue:
  `pnpm kickoff:issue -- --repo <owner/repo> --issue <number>`
- sync labels:
  `pnpm labels:sync -- --repo <owner/repo>`
- if you still want the old command name:
  `pnpm run doctor -- --repo <owner/repo>`

## CLI And Plugin

- the CLI is the stable core
- the Claude Code plugin is a thin entry layer
- `CLI-Anything` and `OpenCLI` are optional adapters, not required dependencies

More precisely:

- Delivery OS handles orchestration
- official CLIs handle mature systems
- `OpenCLI` handles websites, desktop tools, and external systems
- `CLI-Anything` turns source-available tools without good CLIs into reusable command surfaces

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
- plugin guide:
  [docs/plugin.md](/Users/mac/Desktop/other/全栈/docs/plugin.md)
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
