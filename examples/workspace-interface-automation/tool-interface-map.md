# Tool Interface Map

## 1. Outcome

- What are we trying to build: an interface-driven delivery flow that combines repo work, browser automation, and optional adapter generation
- Why does this need external tools or interfaces: the workflow touches GitHub, deployment, browser-driven UI steps, and a source-available tool without a stable CLI
- Expected output or deliverable: one repeatable end-to-end workflow with a documented command surface

## 2. Interface Routing

| Target | Category | Chosen Interface | Why This Path | Owner |
|--------|----------|------------------|---------------|-------|
| GitHub | Hosted service | `gh` | Official CLI already exists | Eng |
| Preview deployment | Hosted service | `vercel` | Official CLI already exists | Eng |
| Admin website | Website | `opencli` | Browser-driven actions are required | Ops |
| Source-available internal tool | Repo | `CLI-Anything` | No stable CLI and the workflow is repetitive | Eng |

## 3. Target Systems

| Target | Access Needed | Entry Command or URL | Auth State | Risks |
|--------|---------------|----------------------|------------|-------|
| GitHub repo | repo + workflow | `gh auth status` | required | wrong repo or missing scopes |
| Deployment project | deploy permissions | `vercel whoami` | required | wrong environment |
| Admin website | browser session | real site URL | required | session expiry |
| Source-available tool | repo access | local path to target repo | required | unstable generated command surface |

## 4. Command Surface

```bash
# official CLI
gh pr status
gh pr checks
vercel
vercel inspect <deployment-url>

# opencli
opencli doctor
opencli daemon status

# CLI-Anything
# /cli-anything /path/to/target
# /cli-anything:refine /path/to/target

# project-local scripts
pnpm lint
pnpm test
```

## 5. Execution Plan

1. Verify auth for GitHub, deployment, and browser session.
2. Confirm the admin website actions that require `opencli`.
3. Decide whether the source-available tool truly needs `CLI-Anything`.
4. Execute the workflow with the smallest reliable command set.
5. Capture logs, screenshots, and rollback notes.

## 6. Validation

- Happy path to validate: create or update something through the repo, verify it through the admin website, and confirm deployment status
- Edge cases: expired session, bad environment, generated adapter mismatch
- Logs or screenshots to capture: `gh pr checks`, deployment inspect output, browser evidence
- Rollback or retry path: revert the repo change, redeploy previous version, re-auth browser session
