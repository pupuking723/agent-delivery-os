# Official CLI Delivery Recipe

Use this recipe when the systems you need already have strong official CLIs.

## Good Fits

- GitHub workflows with `gh`
- Deploy flows with `vercel`
- Containers with `docker`
- Browser testing with project scripts or Playwright

## Why This Recipe

This is the default path. Do not generate extra adapters if the official CLI already solves the job.

## Delivery Pattern

1. Initialize the repository with `delivery-os init`.
2. Create a workspace with `delivery-os feature`.
3. Fill `project-profile.md`, `implementation-plan.md`, and `release-checklist.md`.
4. Execute the workflow through the real CLIs.
5. Capture validation and release evidence.

## Typical Command Surface

```bash
gh issue view <number> --repo <owner/repo>
gh pr create
gh pr checks
pnpm lint
pnpm test
npx playwright test
vercel
vercel --prod
```

## Output Expectation

- one workspace per request
- one implementation plan
- one validation summary
- one release path with rollback
