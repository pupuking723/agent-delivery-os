# Tool Interface Map

Use this document when the task depends on external systems, open-source tools, websites, desktop apps, or internal tools that need an agent-friendly command path.

## 1. Outcome

- What are we trying to build:
- Why does this need external tools or interfaces:
- Expected output or deliverable:

## 2. Interface Routing

| Target | Category | Chosen Interface | Why This Path | Owner |
|--------|----------|------------------|---------------|-------|
| Example: GitHub | Hosted service | `gh` | Official CLI already exists | Eng |
| Example: Figma | Design tool | Figma bridge | Better than generating a custom CLI | Design |
| Example: Internal admin page | Website | `opencli` | Needs browser-driven actions | Ops |
| Example: Source-available desktop tool | App / repo | `CLI-Anything` | No stable CLI, but source is available | Eng |

## 3. Target Systems

For each external target, capture:

| Target | Access Needed | Entry Command or URL | Auth State | Risks |
|--------|---------------|----------------------|------------|-------|
|  |  |  |  |  |

## 4. Command Surface

List the concrete commands the agent should prefer.

```bash
# official CLI

# opencli

# CLI-Anything

# project-local scripts
```

## 5. Execution Plan

1. Verify access and auth.
2. Confirm the chosen interface path for each target.
3. Write or refine the minimum command set.
4. Run the target workflow end to end.
5. Capture validation and fallback steps.

## 6. Validation

- Happy path to validate:
- Edge cases:
- Logs or screenshots to capture:
- Rollback or retry path:

## 7. Notes

- Prefer official CLIs over generated adapters.
- Use `opencli` for websites, Electron apps, or external tools that need a unified control surface.
- Use `CLI-Anything` only when the target lacks a mature CLI and source is available.
- Record the real commands that worked, not abstract intentions.
