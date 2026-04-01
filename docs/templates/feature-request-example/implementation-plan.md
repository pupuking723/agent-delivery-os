# Implementation Plan

**Status**: `approved`
**Owner**: Engineering Lead
**Created**: 2026-04-02
**Last Updated**: 2026-04-02
**Related PRD**: `feature-request-example/PRD.md`
**Related Design Spec**: `feature-request-example/design-spec.md`
**Related Issue**: `GH-142`
**Target Branch**: `feature/multi-member-invites`

## 1. Summary

### 1.1 Goal

Implement a batch invite modal on the members page, support role assignment at invite time, add resend for pending invites, and validate the full flow with frontend, backend, and browser tests.

### 1.2 Inputs

- PRD: approved invite modal PRD
- Design spec: approved modal and members table spec
- Existing code references: members page, invite API, workspace role guards, shared modal and table components
- Constraints or assumptions: max batch size 20, no CSV import, role model limited to member and admin

## 2. Delivery Strategy

### 2.1 Implementation Shape

- Single feature branch with two reviewable PRs if needed
- Behind feature flag `multi_member_invites`
- No schema migration required
- Frontend and backend work can proceed in parallel once API response shape is agreed

### 2.2 Sequence

1. Define API request and response contract for batch invite and resend.
2. Implement backend batch validation, invite send, and audit logging.
3. Build modal UI and input parsing logic behind feature flag.
4. Add resend action to pending invite rows.
5. Add automated tests and browser smoke validation.
6. Ship to preview, verify, then release gradually.

## 3. Code Scope

### 3.1 Files And Modules

| Area | File or Module | Change Type | Notes |
|------|----------------|-------------|-------|
| Frontend | `src/pages/workspace/members.tsx` | modify | Add invite trigger and table resend action |
| Frontend | `src/components/members/invite-members-modal.tsx` | add | New modal shell |
| Frontend | `src/components/forms/multi-email-input.tsx` | add | New reusable parser and row renderer |
| Frontend | `src/lib/invite/parse-emails.ts` | add | Shared normalization utility |
| Backend | `src/server/routes/workspace-invites.ts` | modify | Batch send and resend handlers |
| Backend | `src/server/services/invite-service.ts` | modify | Validation, audit logging, provider dispatch |
| Shared | `src/types/workspace-invites.ts` | modify | Batch response types |
| Tests | `tests/members/invite-members.spec.ts` | add | Browser smoke and happy path |

### 3.2 Systems Touched

- UI
- API
- Analytics
- Audit logging
- Email provider integration

## 4. Technical Design

### 4.1 Proposed Approach

The frontend will parse pasted input into normalized email entries and submit a batch payload with the selected role. The backend will validate each email against malformed input, duplicate batch entries, existing workspace members, and existing pending invites, then return a per-email result array. The modal will keep invalid entries visible so admins can fix them without re-entering the whole batch. Resend will call a dedicated mutation with server-side permission checks and audit logging.

### 4.2 Data Flow

1. Admin opens the modal from the members page.
2. Frontend tokenizes input into normalized email entries.
3. Client submits valid entries and selected role to the batch invite API.
4. Invite service validates and dispatches emails through the provider.
5. API returns per-email status, summary counts, and any skip reasons.
6. Frontend refreshes members data and displays toast or partial success summary.

### 4.3 Interfaces

| Interface | Change | Backward Compatibility | Notes |
|-----------|--------|------------------------|-------|
| `POST /api/workspaces/:id/invites` | modify | no | Extend from single invite to batch payload |
| `POST /api/workspaces/:id/invites/:inviteId/resend` | add | yes | Only for pending invites |
| Members page query | modify | yes | Include pending invite metadata and role |
| Analytics event `workspace_invite_sent` | modify | yes | Add batch size and skipped count |

### 4.4 Error Handling

- Expected failure mode: malformed emails, duplicate emails, provider transient failure, permission denied
- User-facing fallback: inline status for email-level issues, top-level error banner for request failure, row toast for resend failure
- Logging or monitoring requirement: provider failures and permission failures logged with workspace and actor context

## 5. Task Breakdown

### 5.1 Engineering Tasks

| ID | Task | Owner | Depends On | Validation |
|----|------|-------|------------|------------|
| ENG-1 | Finalize API contract and shared types | Backend | | Type checks and API review |
| ENG-2 | Implement batch invite service and audit logging | Backend | ENG-1 | Integration tests |
| ENG-3 | Implement resend mutation and permission checks | Backend | ENG-1 | Integration tests |
| ENG-4 | Build multi-email input and modal UI | Frontend | ENG-1 | Component tests |
| ENG-5 | Add resend action to members table and cache invalidation | Frontend | ENG-3 | Integration tests |
| ENG-6 | Add analytics instrumentation | Full-stack | ENG-2, ENG-4 | Event verification |
| ENG-7 | Add browser smoke coverage | QA or Frontend | ENG-4, ENG-5 | E2E test run |

### 5.2 Non-Engineering Tasks

| ID | Task | Owner | Notes |
|----|------|-------|-------|
| OPS-1 | Verify email provider rate limits for batch sends | Platform | Confirm current thresholds |
| PM-1 | Confirm rollout audience for feature flag | Product | Start with new workspaces only |
| CS-1 | Prepare support note for pending invite resend behavior | Support | Share before rollout |

## 6. Development Prompts

### 6.1 Coding Prompt

Use this when handing implementation work to an agent:

```text
Implement the approved workspace invite modal described in the PRD and design spec.
Scope:
- members page invite trigger
- multi-email invite modal
- batch invite API support
- resend pending invite action
Requirements:
- support up to 20 emails per send
- require role selection before send
- return per-email validation and send results
- hide invite and resend controls from non-admin users
Constraints:
- preserve the current members page structure
- reuse shared modal, select, table, and toast patterns where possible
- add or update tests for frontend, backend, and browser flows
Validation:
- run the smallest reliable test set first
- report any unvalidated paths explicitly
Output:
- summary of changes
- files touched
- tests run
- open risks
```

### 6.2 Review Prompt

Use this when requesting a review:

```text
Review this workspace invite change against the PRD, design spec, and implementation plan.
Focus on:
- permission regressions
- incorrect batch validation behavior
- partial success handling
- UI state mismatches
- missing analytics or audit logs
- missing tests
Report findings first, ordered by severity, with file references.
```

### 6.3 QA Prompt

Use this when handing validation work to an agent:

```text
Validate the workspace invite modal and resend flow against the PRD and release checklist.
Cover:
- single and multi-email invite flows
- invalid, duplicate, and existing-member emails
- pending invite resend
- non-admin permission behavior
- mobile layout and keyboard navigation
- regression risk on the members page
Return:
- pass or fail per scenario
- defects with repro steps
- validation gaps
```

## 7. Test Plan

### 7.1 Automated Tests

| Layer | Test Type | Command | Owner |
|-------|-----------|---------|-------|
| Unit | email parsing and summary formatting | `pnpm test -- parse-emails` | Frontend |
| Integration | batch invite and resend API tests | `pnpm test -- workspace-invites` | Backend |
| E2E | modal invite happy path and resend flow | `npx playwright test tests/members/invite-members.spec.ts` | Frontend |

### 7.2 Manual Tests

- Paste 5 valid emails and verify pending rows appear
- Paste valid and invalid emails together and verify partial success handling
- Log in as non-admin and confirm invite controls are not visible

### 7.3 Smoke Checks

- Critical path: invite one member with member role
- Deploy verification: resend a pending invite in preview
- Rollback verification: disable feature flag and confirm original members page behavior remains intact

## 8. Rollout Notes

### 8.1 Release Controls

- Feature flag: `multi_member_invites`
- Gradual rollout: enable for internal workspaces, then 10% of new workspaces, then all admins
- Kill switch: feature flag off

### 8.2 Observability

- Logs to monitor: invite provider failures, 403 permission errors, resend failures
- Metrics to monitor: batch size distribution, send success rate, resend success rate
- Alerts to check: elevated invite API 5xx or provider timeout spikes

## 9. Risks And Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Existing single-invite clients break on API shape change | High | Maintain backward-compatible single-email handling during rollout |
| Modal complexity hurts accessibility | Medium | Prefer simple row list over complex chip UI and run keyboard checks |
| Provider throttling increases failures | Medium | Keep batch cap at 20 and log provider responses |

## 10. Open Questions

- Should batch results persist in the modal after close for auditability?
- Do we need a dedicated analytics event for skipped duplicate emails?

## 11. Completion Criteria

- [ ] Implementation matches PRD scope
- [ ] Design-critical states are implemented
- [ ] Tests and validation are complete
- [ ] Release checklist is ready
- [ ] Remaining risks are documented
