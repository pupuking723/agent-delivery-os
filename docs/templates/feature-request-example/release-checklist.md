# Release Checklist

**Release Name**: `multi-member-invites`
**Environment**: `production`
**Owner**: Release Manager
**Planned Date**: 2026-04-15
**Related PRD**: `feature-request-example/PRD.md`
**Related PRs**: `#318`, `#322`
**Change Window**: `2026-04-15 10:00-11:00 Asia/Shanghai`

## 1. Release Summary

### 1.1 What Is Shipping

- Batch invite modal for workspace admins
- Role selection at invite time
- Pending invite resend action from the members table
- Analytics and audit logs for invite flows

### 1.2 Why It Matters

- User impact: faster team onboarding and fewer failed invite support tickets
- Business impact: better early-team activation for new workspaces

## 2. Preconditions

- [x] Scope is approved
- [x] Acceptance criteria are met
- [x] Required PRs are merged
- [x] Required migrations are reviewed
- [x] Required env vars or secrets are present
- [x] Rollback owner is assigned

## 3. Validation Before Release

### 3.1 Automated Checks

- [x] Lint passes
- [x] Unit tests pass
- [x] Integration tests pass
- [x] E2E tests pass
- [x] Build passes in CI

### 3.2 Manual Checks

- [x] Core user journey verified
- [x] Empty, error, and loading states checked
- [x] Permissions or auth-sensitive paths checked
- [x] Analytics or event tracking verified
- [x] Accessibility spot check completed

## 4. Deployment Plan

| Step | Command or Action | Owner | Status |
|------|-------------------|-------|--------|
| 1 | Confirm feature flag is off in production | Release Manager | Complete |
| 2 | Create production deployment | Release Manager | Complete |
| 3 | Enable flag for internal workspaces only | Engineering | Complete |
| 4 | Verify invite and resend flow in production | QA | Complete |
| 5 | Expand rollout to all eligible workspaces | Engineering | Pending |

### 4.1 Commands

```bash
gh pr checks
vercel
vercel --prod
```

## 5. Data And Infrastructure Changes

- [ ] Database migration required
- [ ] Backfill required
- [ ] Cache invalidation required
- [x] Queue or cron impact reviewed
- [x] Third-party rate limit or quota impact reviewed

Details:

- Migration plan: none
- Runtime impact: moderate increase in invite provider calls during onboarding peaks
- Recovery notes: disable feature flag if provider error rate spikes

## 6. Monitoring Plan

### 6.1 What To Watch

- Error logs: invite API 4xx and 5xx
- API latency: batch invite endpoint p95
- Job failures: outbound email provider dispatch failures
- Client-side errors: members page modal render errors
- Business KPI: workspaces with 2 or more invited members in first 24 hours

### 6.2 Alert Thresholds

| Signal | Threshold | Owner |
|--------|-----------|-------|
| Invite API 5xx rate | Above baseline by 2x for 15 minutes | Backend |
| Provider timeout rate | Above 3% for 15 minutes | Platform |
| Client invite modal errors | More than 20 occurrences in 30 minutes | Frontend |

## 7. Rollback Plan

### 7.1 Rollback Triggers

- Invite API 5xx rate exceeds threshold after rollout
- Non-admin users see invite controls
- Batch send incorrectly creates duplicate pending invites

### 7.2 Rollback Steps

1. Disable feature flag `multi_member_invites`.
2. Confirm members page returns to legacy invite behavior.
3. Monitor invite API error rate for recovery.
4. Post incident update in engineering and support channels.

### 7.3 Rollback Commands

```bash
# Example
vercel rollback <deployment>
```

## 8. Communication

### 8.1 Pre-Release

- [x] Stakeholders informed
- [x] Support or ops team informed
- [x] Change window confirmed

### 8.2 Post-Release

- [ ] Release announced
- [ ] Known issues documented
- [ ] Follow-up tasks created

## 9. Post-Release Verification

- [ ] Members page loads for admin and non-admin users
- [ ] Batch invite sends at least one successful production invite
- [ ] Resend works for a pending invite
- [ ] Logs show no unexpected spikes
- [ ] Metrics remain within expected range

## 10. Notes

### 10.1 Known Risks

- Email provider throttling may affect very active onboarding windows
- Partial success copy may still generate support questions during first release week

### 10.2 Follow-Ups

- Evaluate per-email role assignment if admins request it
- Consider CSV import if workspaces regularly exceed 20 invites

## 11. Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| Engineering | Eng Lead | Approved | 2026-04-14 |
| Product | PM | Approved | 2026-04-14 |
| QA | QA Lead | Approved | 2026-04-14 |
| Release Owner | Release Manager | Approved | 2026-04-14 |
