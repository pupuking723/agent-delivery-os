# Delivery OS

Use this plugin when the repository follows the Delivery OS workflow and you need a short, reliable Claude Code entrypoint.

## What This Plugin Does

This plugin does not contain the delivery logic itself.
It delegates to the repository CLI:

- `delivery-os init`
- `delivery-os feature`
- `delivery-os issue`
- `delivery-os check`

## Preferred Usage

### Initialize a repository

```bash
delivery-os init --project "New Product" --repo-name "new-product-repo" --repo <owner/repo>
```

### Start a feature workspace

```bash
delivery-os feature --title "Feature title" --summary "Feature summary"
```

If the request depends on websites, external tools, or source-available systems without a mature CLI:

```bash
delivery-os feature --title "Feature title" --summary "Feature summary" --with-interface-map
```

If those cues already appear in the request text, the CLI may add the interface map automatically.
Use `--without-interface-map` only when you explicitly want to suppress it.

### Start from a GitHub issue

```bash
delivery-os issue --repo <owner/repo> --issue <number>
```

### Run a health check

```bash
delivery-os check --repo <owner/repo>
```

## Behavior Rules

- Prefer the CLI over handwritten file mutations when the CLI already supports the task.
- Treat `delivery-os init`, `delivery-os feature`, and `delivery-os check` as the three default user-facing actions.
- Let the CLI auto-add `tool-interface-map.md` when the request text clearly signals interface-heavy work.
- Use `--with-interface-map` when the workspace needs to record interface routing across official CLIs, `OpenCLI`, or `CLI-Anything`.
- Only reference `CLI-Anything` or `OpenCLI` when a downstream repository explicitly needs extra adapters for websites, desktop apps, or non-CLI systems.
- Do not assume those adapters are installed by default.
