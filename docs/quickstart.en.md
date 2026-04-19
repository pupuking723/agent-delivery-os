# Quick Start

If this is your first time using Delivery OS, do not learn everything first.
Start with these 5 entry points:

```bash
pnpm guide
pnpm start:flow --title "Workflow title" --summary "What you want to build"
pnpm bootstrap:all -- --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>
pnpm kickoff --title "Feature title" --summary "Feature summary"
pnpm health:check -- --repo <owner/repo>
pnpm health:check -- --repo <owner/repo> --check-toolchain
```

If you are not even sure which step comes first, run:

```bash
pnpm guide
```

This prints the recommended sequence directly in the terminal. No diagram needed.

If you want the simplest possible entrypoint, run:

```bash
pnpm start:flow --title "Workflow title" --summary "What you want to build"
```

If you want reusable patterns before abstract principles, run:

```bash
pnpm recipes
```

If you already know the interface path, scaffold a starter directly:

```bash
pnpm recipes opencli --title "Workflow title"
```

Before you start, keep one routing rule in mind:

- if the target already has a good CLI, use the official CLI first
- if the target is a website, Electron app, or external tool, use `opencli`
- if the target is source-available but missing a good CLI, consider `CLI-Anything`

## What These 5 Entry Points Do

- `start:flow`
  the lowest-friction entrypoint; it detects the most likely path and scaffolds the starter workspace for you

- `bootstrap:all`
  initializes a new business repository, creates the `docs/project/` scaffold, and configures GitHub metadata and labels
- `kickoff`
  creates a workspace artifact pack for a specific request and routes it to the right mode
- `health:check`
  verifies the local repository structure and GitHub-side setup
- `health:check -- --check-toolchain`
  automatically checks the CLIs inferred from the current repo and workspace

- `health:check -- --check-toolchain all`
  forces a full check of `gh`, `vercel`, `opencli`, and `playwright`

`pnpm guide`
  prints the recommended order and explains what each step is for

If the request depends on websites, desktop tools, external systems, or source-available tools without a mature CLI, start the workspace like this:

```bash
pnpm kickoff --title "Feature title" --summary "Feature summary" --with-interface-map
```

If the title or summary already clearly mentions websites, browsers, dashboards, desktop tools, `opencli`, `CLI-Anything`, or external systems, the CLI now adds this document automatically.

If you want to suppress it explicitly, use:

```bash
pnpm kickoff --title "Feature title" --summary "Feature summary" --without-interface-map
```

## Most Common Usage

### 1. Start a new business repository

```bash
pnpm bootstrap:all -- --project "AI Title Generator" --repo-name "ai-title-generator" --repo <owner/repo>
pnpm health:check -- --repo <owner/repo>
```

### 2. Start a new request

```bash
pnpm kickoff --title "Add team invite flow" --summary "A live product needs team invite, role assignment, and release checks"
```

### 3. Generate a workspace from a GitHub issue

```bash
pnpm kickoff:issue -- --repo <owner/repo> --issue <number>
```

### 4. Validate one specific workspace

```bash
pnpm health:check -- --workspace examples/workspace-interface-automation --skip-remote
```

## What To Say In Claude Code

You can directly say:

- "This is a new idea. Run the 0-to-1 flow."
- "This is a feature for a live product. Use Product Iteration."
- "This is a legacy maintenance task. Build the system map first."

## When To Learn The Advanced Commands

Only go deeper if you need one of these:

- local business repo bootstrap only:
  [docs/repo/template-repo-guide.md](/Users/mac/Desktop/other/全栈/docs/repo/template-repo-guide.md)
- GitHub metadata setup only:
  [docs/repo/github-setup.md](/Users/mac/Desktop/other/全栈/docs/repo/github-setup.md)
- full collaboration workflow:
  [docs/playbook.md](/Users/mac/Desktop/other/全栈/docs/playbook.md)

## Minimum Mental Model

Remember this sentence:

Start with `guide`, run `bootstrap:all` once, use `kickoff` for every request, and finish with `health:check`.
