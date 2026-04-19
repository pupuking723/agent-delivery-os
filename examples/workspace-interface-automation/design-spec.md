# Design Spec

## Information Design

- the user should see the routing choices before seeing implementation details
- recipes should be grouped by interface path, not by abstract architecture
- the example workspace should expose the exact documents a real request would carry

## User Journey

1. Run `pnpm recipes`
2. Pick the closest orchestration recipe
3. Create a workspace with `--with-interface-map`
4. Fill the interface map with real targets and commands
5. Execute and validate the workflow
