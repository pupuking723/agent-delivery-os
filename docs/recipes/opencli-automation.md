# OpenCLI Automation Recipe

Use this recipe when the workflow depends on websites, Electron apps, or desktop tools that need a unified control surface.

## Good Fits

- driving admin websites
- operating SaaS dashboards without official CLIs
- automating Electron tools
- combining browser actions with repo-local code changes

## Required Workspace Shape

Create the workspace with:

```bash
pnpm kickoff --title "Your request" --summary "What you want to automate" --with-interface-map
```

Then fill:

- `tool-interface-map.md`
- `implementation-plan.md`
- `release-checklist.md`

## Delivery Pattern

1. List the external targets in `tool-interface-map.md`.
2. Record the real URLs, auth state, and `opencli` commands.
3. Keep project-local validation separate from browser automation.
4. Treat screenshots, logs, and browser traces as validation evidence.

## Typical Command Surface

```bash
opencli list
opencli doctor
opencli daemon status
# replace with the real target commands for the site or app
```

## Guardrails

- do not hide browser dependencies inside vague instructions
- record the real site entrypoints and auth needs
- separate environment setup problems from product logic problems
