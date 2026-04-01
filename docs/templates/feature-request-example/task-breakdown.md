# Task Breakdown

**Status**: `approved`
**Owner**: Engineering Manager
**Created**: 2026-04-02
**Last Updated**: 2026-04-02
**Related PRD**: `feature-request-example/PRD.md`
**Related Design Spec**: `feature-request-example/design-spec.md`
**Related Implementation Plan**: `feature-request-example/implementation-plan.md`
**Milestone**: `2026-04-15 workspace onboarding improvements`

## 1. Summary

### 1.1 Objective

Deliver the multi-member invite flow with minimal regression risk by splitting frontend, backend, QA, and release work into reviewable tasks with explicit validation.

### 1.2 Delivery Rules

- Keep backend API contract stable for legacy single-invite callers during rollout
- Ship UI behind `multi_member_invites`
- Do not merge resend UI until permission checks are live server-side
- Do not expand the rollout until post-release checks pass

## 2. Workstreams

| Workstream | Goal | Owner | Status |
|------------|------|-------|--------|
| Frontend | Add modal, input parsing, resend action, and UI feedback | Frontend Lead | In Progress |
| Backend | Add batch invite support, resend mutation, and audit logging | Backend Lead | In Progress |
| QA | Validate user flows, permissions, and accessibility | QA Lead | Pending |
| Release | Roll out flag safely and monitor | Release Manager | Pending |

## 3. Task List

| ID | Workstream | Task | Owner | Depends On | Estimate | Status | Validation |
|----|------------|------|-------|------------|----------|--------|------------|
| BE-1 | Backend | Finalize batch invite request and response schema | Backend Lead | | 0.5d | Done | API review |
| BE-2 | Backend | Implement batch invite validation and provider dispatch | Backend Engineer | BE-1 | 1.5d | In Progress | Integration tests |
| BE-3 | Backend | Implement resend endpoint and audit logging | Backend Engineer | BE-1 | 1d | In Progress | Integration tests |
| FE-1 | Frontend | Add invite trigger and modal shell | Frontend Lead | BE-1 | 0.5d | Done | Component test |
| FE-2 | Frontend | Build multi-email parser and validation UI | Frontend Engineer | FE-1, BE-1 | 1.5d | In Progress | Unit and integration tests |
| FE-3 | Frontend | Connect modal submit flow and result summary | Frontend Engineer | FE-2, BE-2 | 1d | Pending | Integration test |
| FE-4 | Frontend | Add resend action to pending invite rows | Frontend Engineer | BE-3 | 0.5d | Pending | Integration test |
| QA-1 | QA | Write and run browser smoke test for happy path | QA Lead | FE-3, BE-2 | 0.5d | Pending | Playwright |
| QA-2 | QA | Validate invalid input, permission, and responsive states | QA Lead | FE-4, BE-3 | 0.5d | Pending | Manual plus Playwright |
| OPS-1 | Release | Confirm rate limits and alert thresholds | Platform | BE-2 | 0.25d | Pending | Monitoring review |
| OPS-2 | Release | Prepare feature flag rollout and rollback notes | Release Manager | QA-2 | 0.25d | Pending | Release review |

## 4. Detailed Tasks

### 4.1 Frontend

| ID | Task | Scope | Risk | Validation | Notes |
|----|------|-------|------|------------|-------|
| FE-1 | Add invite trigger and modal shell | Members page header and modal container | Low | Component render test | Reuse shared modal and footer |
| FE-2 | Build multi-email parser and validation UI | Tokenize input, show status rows, handle deletion | Medium | Unit tests for parsing and UI integration test | Prefer row list over chip UI |
| FE-3 | Connect submit flow and result summary | Submit valid emails, show loading and partial success summary | Medium | Integration test with mocked API | Keep invalid entries visible after partial success |
| FE-4 | Add resend action to pending rows | Table row action, loading state, toast | Low | Integration test | Only show for admins and pending rows |

### 4.2 Backend

| ID | Task | Scope | Risk | Validation | Notes |
|----|------|-------|------|------------|-------|
| BE-1 | Finalize API contract | Shared request and response types | Medium | API review and contract tests | Preserve single-email compatibility |
| BE-2 | Implement batch validation and dispatch | Validate malformed, duplicate, existing-member, and existing-pending states | High | Integration tests | Batch cap at 20 |
| BE-3 | Implement resend endpoint and audit logging | Pending invite resend plus audit log entries | Medium | Integration tests | Rate limit resend |

### 4.3 QA And Validation

| ID | Task | Scope | Risk | Validation | Notes |
|----|------|-------|------|------------|-------|
| QA-1 | Happy-path browser smoke | Admin sends 3 valid invites | Medium | Playwright | Run on preview and production |
| QA-2 | Edge and permission validation | Invalid, duplicate, existing-member, non-admin, mobile | High | Manual and targeted Playwright | Include keyboard navigation |

### 4.4 Release And Ops

| ID | Task | Scope | Risk | Validation | Notes |
|----|------|-------|------|------------|-------|
| OPS-1 | Confirm monitoring and limits | Provider thresholds, alerts, dashboards | Medium | Monitoring review | Before production flag enable |
| OPS-2 | Prepare rollout and rollback plan | Feature flag sequence and rollback owner | Low | Release review | Must be complete before launch |

## 5. Dependency Map

| Task | Blocked By | Why |
|------|------------|-----|
| FE-2 | BE-1 | UI needs final result schema |
| FE-3 | BE-2 | Submit flow depends on real response handling |
| FE-4 | BE-3 | Resend action needs server support |
| QA-1 | FE-3, BE-2 | Happy path requires full invite flow |
| QA-2 | FE-4, BE-3 | Edge validation includes resend and permission checks |
| OPS-2 | QA-2 | Rollout should not proceed before validation |

## 6. Review Plan

### 6.1 PR Strategy

- PR 1: API contract, batch invite backend, and tests
- PR 2: invite modal UI, parser, and submit summary
- PR 3: resend row action, analytics, browser tests, and release docs

### 6.2 Reviewer Focus

| PR or Task Group | Reviewer Focus |
|------------------|----------------|
| Backend | permission enforcement, backward compatibility, audit logging |
| Frontend | state handling, accessibility, members page regressions |
| QA and release | scenario coverage, rollout safety, rollback readiness |

## 7. Validation Matrix

| Scenario | Automated | Manual | Owner |
|----------|-----------|--------|-------|
| Admin sends valid batch | Yes | Yes | QA |
| Invalid and duplicate emails | Yes | Yes | QA |
| Existing member in batch | Yes | Yes | QA |
| Non-admin cannot invite | Yes | Yes | QA |
| Pending invite resend | Yes | Yes | QA |
| Flag off legacy behavior | No | Yes | Release |

## 8. Blockers And Risks

| Item | Type | Severity | Mitigation | Status |
|------|------|----------|------------|--------|
| Legacy clients may expect single-invite response shape | risk | High | Preserve compatibility during rollout | Open |
| Complex chip UI may create accessibility issues | risk | Medium | Use row list design if needed | Open |
| Provider timeout spikes during launch window | blocker | Medium | Limit rollout and monitor provider alerts | Open |

## 9. Completion Criteria

- [ ] All P0 tasks are done
- [ ] Dependent tasks are unblocked or explicitly deferred
- [ ] Validation is complete or gaps are documented
- [ ] Release handoff is ready

## 10. Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-04-02 | Engineering Manager | Initial approved task breakdown |
