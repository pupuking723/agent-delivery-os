# Implementation Plan

**Status**: `draft`
**Owner**:
**Created**:
**Last Updated**:
**Related PRD**:
**Related Design Spec**:
**Related Issue**:
**Target Branch**:

## 1. Summary

### 1.1 Goal

Describe what will be implemented and what done looks like.

### 1.2 Inputs

- PRD:
- Design spec:
- Existing code references:
- Constraints or assumptions:

## 2. Delivery Strategy

### 2.1 Implementation Shape

- Single PR or multiple PRs:
- Behind feature flag or direct release:
- Migration required or not:
- Parallelizable workstreams:

### 2.2 Sequence

1. Step
2. Step
3. Step

## 3. Code Scope

### 3.1 Files And Modules

| Area | File or Module | Change Type | Notes |
|------|----------------|-------------|-------|
| Frontend | `src/...` | modify | |
| Backend | `api/...` | add | |

### 3.2 Systems Touched

- UI
- API
- Database
- Background jobs
- Analytics
- Infrastructure

## 4. Technical Design

### 4.1 Proposed Approach

Describe the implementation approach in concrete terms.

### 4.2 Data Flow

1. Input enters from:
2. Logic executes in:
3. State or data is persisted in:
4. Result is returned to:

### 4.3 Interfaces

| Interface | Change | Backward Compatibility | Notes |
|-----------|--------|------------------------|-------|
| API route, component props, schema, event | add or modify | yes or no | |

### 4.4 Error Handling

- Expected failure mode:
- User-facing fallback:
- Logging or monitoring requirement:

## 5. Task Breakdown

### 5.1 Engineering Tasks

| ID | Task | Owner | Depends On | Validation |
|----|------|-------|------------|------------|
| ENG-1 | Implement core behavior | | | |
| ENG-2 | Add tests | | ENG-1 | |
| ENG-3 | Add analytics or monitoring | | ENG-1 | |

### 5.2 Non-Engineering Tasks

| ID | Task | Owner | Notes |
|----|------|-------|-------|
| OPS-1 | Configure env vars or secrets | | |
| PM-1 | Review rollout plan | | |

## 6. Development Prompts

### 6.1 Coding Prompt

Use this when handing implementation work to an agent:

```text
Implement the approved change described in [PRD] and [Design Spec].
Scope:
- [list the specific files or modules]
Requirements:
- [list critical acceptance criteria]
Constraints:
- preserve existing architecture unless necessary
- keep changes minimal and reviewable
- add or update tests for changed behavior
Validation:
- run the smallest reliable test set first
- report anything not validated
Output:
- summary of changes
- files touched
- tests run
- open risks
```

### 6.2 Review Prompt

Use this when requesting a review:

```text
Review this change against the PRD, design spec, and implementation plan.
Focus on:
- behavioral regressions
- edge cases
- missing tests
- design mismatches
- release risks
Report findings first, ordered by severity, with file references.
```

### 6.3 QA Prompt

Use this when handing validation work to an agent:

```text
Validate this feature against the PRD and release checklist.
Cover:
- primary flow
- edge cases
- error states
- responsive behavior
- accessibility spot checks
- regression risk
Return:
- pass or fail per scenario
- defects with repro steps
- validation gaps
```

## 7. Test Plan

### 7.1 Automated Tests

| Layer | Test Type | Command | Owner |
|-------|-----------|---------|-------|
| Unit | | | |
| Integration | | | |
| E2E | | | |

### 7.2 Manual Tests

- Scenario:
- Scenario:
- Scenario:

### 7.3 Smoke Checks

- Critical path:
- Deploy verification:
- Rollback verification:

## 8. Rollout Notes

### 8.1 Release Controls

- Feature flag:
- Gradual rollout:
- Kill switch:

### 8.2 Observability

- Logs to monitor:
- Metrics to monitor:
- Alerts to check:

## 9. Risks And Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Example: shared component regression | Medium | Add targeted regression tests |

## 10. Open Questions

- Question
- Question

## 11. Completion Criteria

- [ ] Implementation matches PRD scope
- [ ] Design-critical states are implemented
- [ ] Tests and validation are complete
- [ ] Release checklist is ready
- [ ] Remaining risks are documented
