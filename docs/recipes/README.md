# Delivery OS Recipes

These recipes show how to use Delivery OS as an orchestration layer for real creation workflows, not just as a document generator.

## Choose A Recipe

- [official-cli-delivery.md](/Users/mac/Desktop/other/delivery-os/docs/recipes/official-cli-delivery.md)
  Use when the main systems already have mature CLIs.
- [opencli-automation.md](/Users/mac/Desktop/other/delivery-os/docs/recipes/opencli-automation.md)
  Use when the workflow depends on websites, Electron apps, or desktop tools.
- [cli-anything-adapter.md](/Users/mac/Desktop/other/delivery-os/docs/recipes/cli-anything-adapter.md)
  Use when the target is source-available but does not already have a stable CLI.

## Shared Rules

- Prefer official CLIs first.
- Use `opencli` when the workflow depends on browser or desktop actions.
- Use `CLI-Anything` only when the target lacks a mature CLI and source is available.
- If the request depends on external tools, create the workspace with `--with-interface-map`.

## Recommended Start

```bash
pnpm recipes
pnpm recipes opencli --title "Your request"
```

## Scaffold Directly

```bash
pnpm recipes official-cli --title "Ship a feature with existing CLIs"
pnpm recipes opencli --title "Automate an admin website"
pnpm recipes cli-anything --title "Create a reusable adapter for a source-available tool"
```
