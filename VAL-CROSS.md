# Validation Contract: Cross-Area Flows

### VAL-CROSS-001: First-Visit Journey End-to-End
A new user lands on `/`, clicks a sign-up CTA, completes email registration, is redirected to `/plan/new`, creates a transfer plan via the AI chat interface, and is then able to see the newly created plan listed on `/dashboard`. **Pass** if every transition completes without error and the plan appears on the dashboard with the correct title and semester data. **Fail** if any step drops the user, the plan is missing from the dashboard, or the user is stranded on an intermediate page.
Tool: agent-browser
Evidence: Screenshots at each stage (landing → sign-up form → plan creation chat → dashboard with new plan); final dashboard DOM showing the plan entry.

### VAL-CROSS-002: Auth Gate Redirect-Back on Plan Creation
An unauthenticated user navigates directly to `/plan/new`. The app redirects to the sign-in page. After signing in with valid credentials, the user is automatically returned to `/plan/new` (not `/dashboard` or `/`). **Pass** if the post-auth redirect lands on `/plan/new` and the AI chat interface is functional. **Fail** if the user lands anywhere other than `/plan/new` or if the redirect target is lost during the auth flow.
Tool: agent-browser
Evidence: URL captured after sign-in redirect; screenshot of `/plan/new` loaded post-auth; browser network log showing the redirect chain.

### VAL-CROSS-003: Plan Creation → Course Failure → Recovery → Persistence
User creates a plan on `/plan/new`, navigates to `/plan/[id]`, marks a course as failed, receives an AI-generated recovery suggestion, accepts the alternative course, and verifies the plan view updates in-place. The user then reloads the page. **Pass** if the failed course shows its failed status, the accepted alternative is present in the plan, and both survive a full page reload. **Fail** if the failure mark reverts, the alternative disappears, or the plan state differs after reload.
Tool: agent-browser
Evidence: Screenshots before marking failure, after accepting recovery, and after page reload; DOM snapshots of the plan's course list at each stage.

### VAL-CROSS-004: Auth Gate Redirect-Back on Playbook Submission
An unauthenticated user navigates to `/playbooks/submit`. The app redirects to sign-in. After signing in, the user is returned to `/playbooks/submit` with the submission form ready. **Pass** if the post-auth URL is `/playbooks/submit` and the form is interactive. **Fail** if the user lands elsewhere or form state is broken.
Tool: agent-browser
Evidence: URL captured after sign-in; screenshot of the submission form rendered post-auth.

### VAL-CROSS-005: Data Persistence Across Sessions
User signs in, creates a plan with specific course data, then signs out. The user signs back in with the same credentials. **Pass** if `/dashboard` shows the previously created plan with all course details intact (plan title, semester breakdown, course names). **Fail** if the plan is missing, partially loaded, or shows different data than what was originally created.
Tool: agent-browser
Evidence: Screenshot of dashboard after initial plan creation; screenshot of dashboard after re-login; text comparison of plan titles and course counts between sessions.

### VAL-CROSS-006: Recovery Persistence Across Sessions
Starting from an existing plan, user marks a course as failed, accepts the AI recovery suggestion, then signs out and signs back in. User navigates to `/plan/[id]`. **Pass** if the failed course still shows its failed status and the accepted alternative course is present in the plan. **Fail** if failure status or recovery changes reverted after the session boundary.
Tool: agent-browser
Evidence: Screenshot of plan with recovery applied pre-logout; screenshot of same plan post-login; DOM diff of course list elements between sessions.

### VAL-CROSS-007: Multiple Plans Management
User creates Plan A via `/plan/new`, returns to `/dashboard`, then creates Plan B via `/plan/new`. On `/dashboard`, both plans are listed. User clicks into Plan A, verifies its data, returns to dashboard, clicks into Plan B, verifies its data. **Pass** if both plans are independently accessible with correct, non-overlapping data. **Fail** if plans are missing, duplicated, merged, or if navigating between them corrupts either plan's data.
Tool: agent-browser
Evidence: Dashboard screenshot showing both plans; screenshots of each plan's detail page; plan titles and course lists captured for comparison.

### VAL-CROSS-008: Plan View to Playbook Browsing Navigation
While viewing a plan at `/plan/[id]`, user navigates to `/playbooks` (via nav or link). User browses playbook listings, clicks into a playbook detail at `/playbooks/[id]`, then navigates back to their plan at `/plan/[id]`. **Pass** if all navigation transitions succeed, the playbook content loads correctly, and returning to the plan shows the same state as before the detour. **Fail** if any navigation link is missing/broken, the plan state changes after returning, or the user hits a dead end.
Tool: agent-browser
Evidence: Screenshots of plan view → playbook listing → playbook detail → plan view; URL history trace; plan state comparison before and after playbook browsing.

### VAL-CROSS-009: Navigation Completeness — No Dead Ends
From `/dashboard`, the user can reach: `/plan/new`, an existing `/plan/[id]`, `/playbooks`, and `/playbooks/submit`. From `/playbooks`, the user can reach `/playbooks/[id]` and navigate back. From any interior page, the user can return to `/dashboard`. **Pass** if every documented route is reachable through visible UI elements (links, buttons, nav bar) without manually editing the URL. **Fail** if any route requires direct URL entry or if any page lacks a navigation path back to the dashboard.
Tool: agent-browser
Evidence: For each page, screenshot with navigation elements highlighted; clickable element inventory per page; reachability matrix showing which pages link to which.

### VAL-CROSS-010: Concurrent Plan Editing Isolation
User opens Plan A in one browser tab and Plan B in another tab. User marks a course as failed in Plan A and accepts recovery. User switches to the Plan B tab and reloads. **Pass** if Plan B is completely unaffected by the changes made to Plan A — no failed courses, no recovery suggestions, no stale data. **Fail** if any state from Plan A leaks into Plan B's view.
Tool: agent-browser
Evidence: Screenshots of Plan A after recovery; screenshots of Plan B after reload; course-list DOM comparison showing Plan B is unchanged.

### VAL-CROSS-011: Playbook Submission End-to-End with Auth
Authenticated user navigates to `/playbooks/submit`, fills in the transfer story form, and submits. User then navigates to `/playbooks` and locates their submitted playbook in the listing. User clicks into the playbook detail at `/playbooks/[id]` and verifies the content matches what was submitted. **Pass** if the playbook appears in the listing and the detail page reflects the submitted content accurately. **Fail** if the submission silently fails, the playbook is missing from the listing, or the detail content differs from the submission.
Tool: agent-browser
Evidence: Screenshot of completed submission form; screenshot of playbooks listing showing the new entry; screenshot of playbook detail page; text comparison of submitted vs. displayed content.
