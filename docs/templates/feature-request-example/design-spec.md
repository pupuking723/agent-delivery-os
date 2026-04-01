# Design Spec

**Status**: `approved`
**Owner**: Product Designer
**Created**: 2026-04-02
**Last Updated**: 2026-04-02
**Related PRD**: `feature-request-example/PRD.md`
**Figma File**: `Team Management`
**Figma Nodes**: `Invite Modal`, `Members Table Pending Row`

## 1. Summary

### 1.1 Design Goal

Help admins invite teammates quickly without losing clarity about who will be invited, what role they will receive, or why some emails cannot be sent.

### 1.2 Design Scope

This spec covers the members page invite entry point, invite modal states, resend action in the members table, and supporting toast feedback.

## 2. References

- Product requirement: invite modal PRD
- Existing implementation: members page, shared modal, shared select, shared table
- Design system: form field, chip, modal footer, toast patterns
- Comparable screens: billing invite flow, access request approval modal

## 3. Screen Inventory

| Screen or Surface | Purpose | Status |
|-------------------|---------|--------|
| Members page header | Entry point for invite action | Modified |
| Invite modal | Enter emails and role | New |
| Members table pending row | Resend pending invite | Modified |
| Success toast | Confirm send or resend | Modified |

## 4. Information Architecture

### 4.1 Entry Points

- Members page top-right primary action button labeled `Invite Members`
- Pending invite row secondary action labeled `Resend`
- Only visible to workspace admins

### 4.2 Navigation

- Opening the modal does not navigate away from the members page
- Closing the modal returns focus to the trigger button
- Resend action stays inline in the table and does not open a separate flow

## 5. Interaction Spec

### 5.1 Primary Journey

1. Admin lands on members page.
2. Admin sees `Invite Members` in header actions.
3. Admin opens the modal and focuses the email input.
4. Admin pastes one or more emails.
5. System tokenizes the input into email rows with validation badges.
6. Admin selects a role and reviews the valid count.
7. Admin clicks `Send Invites`.
8. Modal enters sending state, then success or partial success state.
9. Modal closes on full success or remains open with errors highlighted on partial success.

### 5.2 State Matrix

| State | Trigger | Required UI |
|-------|---------|-------------|
| Default | Initial open | Empty email field, role selector, disabled primary button |
| Loading | Send request pending | Primary button spinner, fields disabled |
| Empty | No valid emails | Helper text and disabled submit |
| Error | Validation or API failure | Inline error badges, top-level error message if request fails |
| Success | All invites sent | Success toast and table refresh |
| Disabled | Viewer lacks permissions | Trigger absent from UI |

## 6. Layout And Visual Rules

### 6.1 Structure

- Modal width: medium desktop modal, full-width sheet on small mobile
- Header contains title and short helper text
- Body contains email entry area above role selector
- Footer contains cancel and primary submit actions
- Partial success summary appears above the footer if any entries fail

### 6.2 Spacing And Sizing

- 24px padding desktop, 16px mobile
- 12px vertical spacing between form groups
- Email rows or chips should wrap without horizontal scroll
- Minimum touch target: 44px for primary actions and row actions

### 6.3 Typography

| Element | Style | Notes |
|---------|-------|-------|
| Modal title | Heading medium | Clear, action-oriented |
| Helper text | Body small | Explain batch input behavior |
| Validation badge text | Label small | Keep short, use sentence case |
| Summary text | Body small | Include count of sent and skipped |

### 6.4 Color And Visual Treatment

- Use standard surface modal background
- Valid emails use neutral chips or rows
- Invalid or duplicate emails use destructive accent with icon
- Success state uses existing success toast styling
- Ensure 4.5:1 text contrast on validation indicators

## 7. Components

| Component | Purpose | Variants | Reuse Existing | Notes |
|-----------|---------|----------|----------------|-------|
| Modal | Container for invite flow | Default, partial success | Yes | Use shared modal shell |
| Multi-email input | Capture and display parsed emails | Default, invalid, duplicate | No | New component |
| Select | Choose role | Member, Admin | Yes | Use shared select |
| Table action button | Resend pending invite | Default, loading | Yes | Inline row action |
| Toast | Confirm outcome | Success, error | Yes | Existing global toast |

For each new or changed component, capture:

- Multi-email input must support paste, keyboard entry, removal, and inline status
- Resend button must display loading state only for the target row
- Summary text must not rely on color alone to communicate skipped entries

## 8. Content Spec

### 8.1 Copy Rules

- Tone: direct, calm, administrative
- Terminology: use `invite`, `pending invite`, `workspace admin`, `member role`
- Must-use labels: `Invite Members`, `Send Invites`, `Resend`
- Terms to avoid: `submit`, `invalid recipient`, `processing error`

### 8.2 Text Inventory

| Location | Copy | Notes |
|----------|------|-------|
| Modal title | Invite members | Sentence case |
| Helper text | Paste one or more email addresses. We will send invites to valid entries only. | Keep under two lines |
| Role label | Role | |
| Primary CTA | Send Invites | |
| Empty helper | Enter at least one valid email address. | |
| Duplicate badge | Duplicate | Inline status |
| Existing member badge | Already in workspace | Inline status |
| Success toast | 5 invites sent | Replace count dynamically |
| Partial summary | 4 invites sent, 2 skipped. Review the highlighted entries. | Keep actionable |

## 9. Accessibility

### 9.1 Requirements

- Keyboard navigation: full modal usable without mouse
- Focus order: title, email input, parsed rows, role select, footer actions
- Screen reader labels: each invalid email row announces its error reason
- Contrast: validation states must meet contrast requirements
- Motion reduction: spinner and toast transitions should respect reduced-motion settings

### 9.2 Critical Checks

- [ ] All interactive elements have accessible names
- [ ] Focus is visible in all states
- [ ] Error states are announced or discoverable
- [ ] Color is not the only status signal

## 10. Data And System Feedback

### 10.1 Data Dependencies

- Members table query must include pending invite state
- Invite endpoint must return per-email status and reason
- Resend action must return success or rate-limit failure

### 10.2 Feedback Patterns

| Situation | Feedback Pattern |
|-----------|------------------|
| Send in progress | Disable form and show spinner on primary button |
| Send success | Success toast and close modal |
| Send failure | Preserve modal content and show inline and top-level feedback |
| Background sync | Refresh members table without full page reload |

## 11. Implementation Handoff

### 11.1 Engineering Notes

- Multi-email input can be row-based rather than chip-based if chips create accessibility debt
- Avoid building a custom combobox for role selection; reuse existing select
- Table refresh should preserve current sorting and filters
- Partial success should not clear invalid entries automatically

### 11.2 Test Targets

- Responsive checks for 320px, 768px, and desktop
- State coverage for empty, invalid, loading, partial success, and full success
- Accessibility checks for keyboard navigation and screen reader labels
- Visual regression targets for modal and pending invite row action

## 12. Open Questions

- Should pending invites display the assigned role directly in the table?
- Should resend show the original sent time in the confirmation toast?

## 13. Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| Product | PM | Approved | 2026-04-02 |
| Design | Designer | Approved | 2026-04-02 |
| Engineering | Eng Lead | Approved | 2026-04-02 |
