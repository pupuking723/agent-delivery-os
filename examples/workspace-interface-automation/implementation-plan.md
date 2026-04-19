# Implementation Plan

## Goal

Turn the abstract interface-routing principle into a reusable system entrypoint.

## Work Items

1. Add a `recipes` CLI command.
2. Add recipe documents for official CLIs, `opencli`, and `CLI-Anything`.
3. Add a sample workspace showing `tool-interface-map.md` in context.
4. Link the new entrypoints from quickstart and README surfaces.

## Validation

- `node packages/cli/bin/delivery-os.mjs recipes`
- `pnpm recipes`
- verify the recipe files exist
- verify the example workspace contains the expected artifacts
