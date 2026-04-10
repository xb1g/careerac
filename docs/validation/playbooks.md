# Validation Contract: Community Playbooks

### VAL-PLAYBOOK-001: Browse page renders playbook list
Navigate to `/playbooks`. The page loads and displays a list of playbook cards. Each card shows at minimum: contributor's community college, target school, major, and transfer year. Pass if at least one playbook card is visible with all four fields populated.
Tool: agent-browser
Evidence: Screenshot of `/playbooks` showing rendered playbook cards with CC, target school, major, and transfer year visible.

### VAL-PLAYBOOK-002: Filter playbooks by community college, target school, and major
On `/playbooks`, use the filter/search controls to filter by a specific community college, then by target school, then by major. After each filter application, the displayed playbook list updates to show only matching results. Pass if the list visibly changes after each filter and all visible cards match the selected filter value.
Tool: agent-browser
Evidence: Screenshots after each filter application showing filtered results that match the selected criteria.

### VAL-PLAYBOOK-003: Empty state when no playbooks match filter
On `/playbooks`, apply a filter combination that returns zero results (e.g., an obscure CC + unrelated major). The page displays an empty state message instead of playbook cards. Pass if a clear empty-state message (e.g., "No playbooks found") is shown and no playbook cards are rendered.
Tool: agent-browser
Evidence: Screenshot of the empty state UI after applying a filter with no matching results.

### VAL-PLAYBOOK-004: Playbook detail view shows full semester-by-semester path
Click into a playbook from `/playbooks` to reach `/playbooks/[id]`. The detail page shows the student's full path: community college, target school, major, outcome, and a semester-by-semester breakdown listing courses taken per semester. Pass if at least two semesters are displayed, each with at least one course listed.
Tool: agent-browser
Evidence: Screenshot of `/playbooks/[id]` showing semester sections with courses enumerated.

### VAL-PLAYBOOK-005: Failure events highlighted with resolution on detail view
On a playbook detail page (`/playbooks/[id]`) for a playbook that contains failure events, failure events are visually highlighted (distinct color, icon, or badge) and each includes a description of how the failure was resolved. Pass if failure events are visually distinct from regular course entries and resolution text is present.
Tool: agent-browser
Evidence: Screenshot of the detail page with failure events visually highlighted and resolution descriptions visible.

### VAL-PLAYBOOK-006: Verified playbook displays verified badge
On `/playbooks/[id]` for a verified (confirmed transfer) playbook, a "verified" badge or indicator is visible near the playbook title or outcome. Pass if the badge is rendered and clearly identifies the playbook as verified.
Tool: agent-browser
Evidence: Screenshot of a verified playbook detail page showing the verified badge.

### VAL-PLAYBOOK-007: Unverified playbook displays "inspiration only" badge
On `/playbooks/[id]` for an unverified (in-progress student) playbook, an "inspiration only" badge is displayed prominently. The badge signals that the playbook is not used in AI planning. Pass if the "inspiration only" badge is visible and the playbook does not display a verified badge.
Tool: agent-browser
Evidence: Screenshot of an unverified playbook detail page showing the "inspiration only" badge without a verified indicator.

### VAL-PLAYBOOK-008: Unauthenticated user redirected to sign in on submit
While logged out, navigate to `/playbooks/submit`. The user is redirected to the sign-in page (or a modal/prompt requiring authentication appears) before the submission form is accessible. Pass if the submission form is NOT rendered and the user lands on a sign-in flow.
Tool: agent-browser
Evidence: Screenshot showing the sign-in page/redirect after attempting to access `/playbooks/submit` while unauthenticated.

### VAL-PLAYBOOK-009: Authenticated user accesses multi-step submission form
While logged in, navigate to `/playbooks/submit` (or click "Share Your Story" from `/playbooks`). A multi-step form is displayed. The first step collects basic info (community college, target school, major, transfer year). Subsequent steps collect semester-by-semester courses, failure events, and outcome. Pass if at least three distinct form steps are navigable via next/back controls.
Tool: agent-browser
Evidence: Screenshots of each form step showing: (1) basic info fields, (2) semester/course entry, (3) failure events, and (4) outcome selection.

### VAL-PLAYBOOK-010: Playbook submission results in pending verification status
Complete and submit the playbook form as an authenticated user with valid data. After submission, the user sees a confirmation and the newly created playbook displays a "pending verification" status. Pass if the post-submission state shows the playbook with a pending verification indicator.
Tool: agent-browser
Evidence: Screenshot of the confirmation/post-submit view showing the playbook with "pending verification" status.

### VAL-PLAYBOOK-011: "Share Your Story" CTA navigates to submission form
On `/playbooks`, locate and click the "Share Your Story" call-to-action button. The user is navigated to `/playbooks/submit`. Pass if clicking the CTA lands the user on the playbook submission form page.
Tool: agent-browser
Evidence: Screenshot showing the CTA on the browse page, then a screenshot of the resulting submission form page after click.

### VAL-PLAYBOOK-012: Playbook browse cards distinguish verified from unverified
On `/playbooks`, with both verified and unverified playbooks present in the list, verified playbooks show a verified badge on their card and unverified playbooks show an "inspiration only" label. Pass if cards of each type are visually distinguishable by their badge/label in the list view.
Tool: agent-browser
Evidence: Screenshot of the browse page showing at least one verified card with its badge and one unverified card with the "inspiration only" label side by side.
