# CLI-Anything Adapter Recipe

Use this recipe when the target is source-available but missing a mature CLI, and the work is valuable enough to justify a reusable command surface.

## Good Fits

- internal tools with source access
- open-source projects with poor agent ergonomics
- repetitive operator workflows that should become deterministic

## Required Workspace Shape

Create the workspace with:

```bash
pnpm kickoff --title "Your request" --summary "What you want to build" --with-interface-map
```

Then fill:

- `tool-interface-map.md`
- `implementation-plan.md`
- `task-breakdown.md`

## Delivery Pattern

1. Confirm there is no better official CLI.
2. Map the target repo, entrypoints, and auth requirements.
3. Use `CLI-Anything` to generate the minimum useful command surface.
4. Refine the generated interface until it is stable.
5. Validate the adapter against one real end-to-end workflow.

## Typical Command Surface

```text
/cli-anything /path/to/target
/cli-anything:refine /path/to/target
/cli-anything:test /path/to/target
/cli-anything:validate /path/to/target
```

## Guardrails

- do not use this path for GitHub, Vercel, Docker, or Figma
- do not use it when the target already has a mature CLI
- document the exact workflow the adapter is supposed to unlock
