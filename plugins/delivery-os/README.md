# Delivery OS Plugin

Repo-local Claude Code plugin for the Delivery OS workflow.

This plugin is intentionally thin:

- it does not reimplement routing or repository logic
- it relies on the `delivery-os` CLI exposed by this repository
- it points Claude Code to the right commands for init, feature kickoff, issue kickoff, and health checks

## Main Actions

- `delivery-os init`
- `delivery-os feature`
- `delivery-os issue`
- `delivery-os check`

## Why It Exists

The CLI is the stable core.
The plugin is the Claude Code-native entry layer.

## Optional Integrations

This plugin does not require `CLI-Anything` or `OpenCLI`.
Those should be treated as optional adapters for downstream repositories when external tools or non-CLI systems must be automated.
