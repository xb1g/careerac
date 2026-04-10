# Validation Contract: Foundation & Auth

### VAL-AUTH-001: Landing page loads with hero content and CTA
The public landing page at `/` renders a visible hero section containing a headline, subheadline, and a primary call-to-action button (e.g., "Get Started"). The CTA button links to `/auth/signup` or `/auth/signin`. Pass: hero section and CTA are visible and the CTA navigates to an auth page. Fail: page errors, hero content missing, or CTA absent/broken.
Tool: agent-browser
Evidence: Screenshot of landing page showing hero and CTA; navigation target URL of CTA button.

### VAL-AUTH-002: Sign up with email and password
A new user navigates to `/auth/signup`, enters a valid email and password, and submits the form. The system creates an account and either redirects to `/dashboard` or shows a confirmation/verification prompt. Pass: account is created, no error displayed, and user is redirected appropriately. Fail: form submission errors, account not created, or redirect does not occur.
Tool: agent-browser
Evidence: Screenshot of signup form filled in; screenshot of post-signup state (dashboard or confirmation); network response status for signup request.

### VAL-AUTH-003: Sign in with email and password
An existing user navigates to `/auth/signin`, enters valid credentials, and submits. The system authenticates the user and redirects to `/dashboard`. Pass: user lands on `/dashboard` with authenticated state visible (e.g., user email in header, sign-out button present). Fail: sign-in rejected with valid credentials, redirect does not occur, or dashboard does not reflect authenticated state.
Tool: agent-browser
Evidence: Screenshot of signin form; screenshot of dashboard post-login showing authenticated indicators; current URL confirming `/dashboard`.

### VAL-AUTH-004: Sign out ends session
An authenticated user clicks the sign-out button/link in the header navigation. The session is terminated, the user is redirected to `/` or `/auth/signin`, and protected routes are no longer accessible without re-authenticating. Pass: user is signed out, redirected away from protected routes, and subsequent navigation to `/dashboard` redirects to sign-in. Fail: session persists after sign-out, or protected routes remain accessible.
Tool: agent-browser
Evidence: Screenshot before sign-out showing authenticated state; screenshot after sign-out showing unauthenticated state; screenshot of attempting to access `/dashboard` after sign-out confirming redirect to sign-in.

### VAL-AUTH-005: Session persists across page refreshes
An authenticated user on `/dashboard` refreshes the page (hard reload). After reload, the user remains authenticated and the dashboard renders without requiring re-authentication. Pass: page reload preserves authenticated state, dashboard content visible, no redirect to sign-in. Fail: user is logged out on refresh or redirected to sign-in.
Tool: agent-browser
Evidence: Screenshot of dashboard pre-refresh; screenshot of dashboard post-refresh showing same authenticated state; current URL confirming `/dashboard` after refresh.

### VAL-AUTH-006: Protected route redirects unauthenticated users
An unauthenticated user (no active session) navigates directly to `/dashboard`. The system redirects the user to `/auth/signin` (or an equivalent auth page) before rendering any protected content. Pass: user is redirected to sign-in page, no protected content flashes or is exposed. Fail: dashboard content is visible to unauthenticated user, or no redirect occurs.
Tool: agent-browser
Evidence: Screenshot after navigating to `/dashboard` without auth showing the sign-in page; current URL confirming redirect destination.

### VAL-AUTH-007: Invalid sign-in shows error message
A user navigates to `/auth/signin` and submits with an incorrect password for an existing email. The system displays a user-facing error message (e.g., "Invalid login credentials") without exposing internal details. The form remains usable for retry. Pass: error message is visible, form is not cleared/disabled, no redirect occurs. Fail: no error shown, generic server error exposed, or form becomes unusable.
Tool: agent-browser
Evidence: Screenshot of sign-in form with error message visible after invalid submission.

### VAL-AUTH-008: Duplicate email sign-up shows error
A user navigates to `/auth/signup` and attempts to register with an email address that already has an account. The system displays an appropriate error message (e.g., "User already registered") without leaking sensitive information. Pass: error message displayed, user can correct input. Fail: no feedback given, system creates duplicate account, or unhandled server error shown.
Tool: agent-browser
Evidence: Screenshot of signup form showing duplicate-email error message.

### VAL-AUTH-009: Post-sign-in redirect lands on dashboard
After a successful sign-in from `/auth/signin`, the user is redirected to `/dashboard` as the default authenticated landing page. The dashboard page renders meaningful content (not a blank or error state). Pass: URL is `/dashboard` and page content loads. Fail: user lands on wrong route, sees a blank page, or encounters an error.
Tool: agent-browser
Evidence: Screenshot of dashboard page after sign-in; current URL confirming `/dashboard`.

### VAL-LAYOUT-010: Header navigation present and functional
On any authenticated page, a header/navbar is visible containing navigation links to main sections (e.g., Dashboard, Plans, Playbooks) and a sign-out control. Clicking each nav link navigates to the correct route without full-page reload (client-side navigation). Pass: all nav links are visible and navigate to correct destinations. Fail: nav links missing, broken, or cause errors.
Tool: agent-browser
Evidence: Screenshot of header with navigation links highlighted; screenshots after clicking each nav link confirming correct route.

### VAL-LAYOUT-011: Responsive layout on mobile viewport
The landing page and dashboard render correctly on a mobile viewport (375×812, iPhone-class). The layout does not overflow horizontally, text is readable without zooming, and navigation is accessible (e.g., hamburger menu or stacked layout). Pass: no horizontal scroll, all interactive elements reachable, content legible. Fail: layout breaks, content overflows, or navigation is inaccessible on mobile.
Tool: agent-browser
Evidence: Screenshot of landing page at 375×812 viewport; screenshot of dashboard at 375×812 viewport; screenshot of mobile navigation menu if applicable.

### VAL-LAYOUT-012: Auth callback route processes redirect
The `/auth/callback` route correctly processes the authentication callback (e.g., from Supabase email confirmation or OAuth). After processing, the user is redirected to `/dashboard` with an active session. Pass: callback processes without visible error, session is established, user reaches dashboard. Fail: callback page shows an error, session is not created, or user is stuck on the callback route.
Tool: agent-browser
Evidence: Observation of redirect chain from `/auth/callback` to `/dashboard`; screenshot of final destination confirming authenticated state.

### VAL-AUTH-013: Empty form submission shows validation errors
A user on `/auth/signin` or `/auth/signup` submits the form with empty email and/or password fields. The system displays client-side validation errors (e.g., "Email is required", "Password is required") before making any network request. Pass: validation errors appear inline, no network request is fired. Fail: form submits with empty fields, no validation feedback, or server error shown instead of client validation.
Tool: agent-browser
Evidence: Screenshot of form showing inline validation errors for empty fields.
