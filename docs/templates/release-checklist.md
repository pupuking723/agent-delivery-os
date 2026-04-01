# Release Checklist

**Release Name**:
**Environment**:
**Owner**:
**Planned Date**:
**Related PRD**:
**Related PRs**:
**Change Window**:

## 1. Release Summary

### 1.1 What Is Shipping

- Item
- Item

### 1.2 Why It Matters

- User impact:
- Business impact:

## 2. Preconditions

- [ ] Scope is approved
- [ ] Acceptance criteria are met
- [ ] Required PRs are merged
- [ ] Required migrations are reviewed
- [ ] Required env vars or secrets are present
- [ ] Rollback owner is assigned

## 3. Validation Before Release

### 3.1 Automated Checks

- [ ] Lint passes
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Build passes in CI

### 3.2 Manual Checks

- [ ] Core user journey verified
- [ ] Empty, error, and loading states checked
- [ ] Permissions or auth-sensitive paths checked
- [ ] Analytics or event tracking verified
- [ ] Accessibility spot check completed

## 4. Deployment Plan

| Step | Command or Action | Owner | Status |
|------|-------------------|-------|--------|
| 1 | Create preview deployment | | Pending |
| 2 | Verify preview behavior | | Pending |
| 3 | Promote or deploy to production | | Pending |
| 4 | Run post-release checks | | Pending |

### 4.1 Commands

```bash
# Example
gh pr checks
vercel
vercel --prod
```

## 5. Data And Infrastructure Changes

- [ ] Database migration required
- [ ] Backfill required
- [ ] Cache invalidation required
- [ ] Queue or cron impact reviewed
- [ ] Third-party rate limit or quota impact reviewed

Details:

- Migration plan:
- Runtime impact:
- Recovery notes:

## 6. Monitoring Plan

### 6.1 What To Watch

- Error logs:
- API latency:
- Job failures:
- Client-side errors:
- Business KPI:

### 6.2 Alert Thresholds

| Signal | Threshold | Owner |
|--------|-----------|-------|
| Example: 5xx rate | Above baseline by 2x | |

## 7. Rollback Plan

### 7.1 Rollback Triggers

- Trigger
- Trigger

### 7.2 Rollback Steps

1. Disable feature flag or stop rollout.
2. Revert or redeploy previous stable version.
3. Verify critical paths recover.
4. Notify stakeholders and record incident notes.

### 7.3 Rollback Commands

```bash
# Example
vercel rollback <deployment>
```

## 8. Communication

### 8.1 Pre-Release

- [ ] Stakeholders informed
- [ ] Support or ops team informed
- [ ] Change window confirmed

### 8.2 Post-Release

- [ ] Release announced
- [ ] Known issues documented
- [ ] Follow-up tasks created

## 9. Post-Release Verification

- [ ] Landing page or entry point loads
- [ ] Primary conversion or success path works
- [ ] Auth flow works
- [ ] Logs show no unexpected spikes
- [ ] Metrics remain within expected range

## 10. Notes

### 10.1 Known Risks

- Risk
- Risk

### 10.2 Follow-Ups

- Follow-up
- Follow-up

## 11. Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| Engineering | | Pending | |
| Product | | Pending | |
| QA | | Pending | |
| Release Owner | | Pending | |
