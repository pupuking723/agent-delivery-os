# Quick Start

If this is your first time using Delivery OS, do not learn everything first.
Just remember these 3 commands:

```bash
pnpm bootstrap:all -- --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>
pnpm kickoff --title "Feature title" --summary "Feature summary"
pnpm health:check -- --repo <owner/repo>
```

## What These 3 Commands Do

- `bootstrap:all`
  initializes a new business repository, creates the `docs/project/` scaffold, and configures GitHub metadata and labels
- `kickoff`
  creates a workspace artifact pack for a specific request and routes it to the right mode
- `health:check`
  verifies the local repository structure and GitHub-side setup

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

Run `bootstrap:all` first, use `kickoff` for every request, and finish with `health:check`.
