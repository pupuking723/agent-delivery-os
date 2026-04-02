# Security Policy

## Supported Versions

This repository is currently maintained as a single rolling `main` branch.
Security fixes are applied to the latest published release line.

| Version | Supported |
| --- | --- |
| `v0.x` | Yes |
| Older snapshots | No |

## Reporting a Vulnerability

Please do not open a public issue for suspected security problems.

Report privately with:

- a short summary of the issue
- affected files or workflows
- reproduction steps
- impact assessment if known

Preferred contact path:

- open a private security advisory on GitHub if available
- otherwise contact the repository owner directly and include the repository URL

## Response Expectations

- Initial triage target: within 7 days
- Status update target: within 14 days
- Fix and disclosure timing depends on severity and exploitability

## Scope

This policy mainly applies to:

- GitHub Actions workflows
- automation scripts under `scripts/`
- repository templates and prompt packs
- generated workspace metadata and documentation paths

Third-party services or tools integrated by downstream repositories are out of scope for this repository unless the issue is caused by code or configuration here.
