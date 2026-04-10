# Validation Contract: AI Plan Generation

### VAL-CHAT-001: Welcome message on new plan
When a user navigates to `/plan/new`, the chat interface loads and displays a welcome message prompting the user to describe their community college, target transfer school, and intended major. The message must appear within 3 seconds of page load without any user input.
Tool: agent-browser
Evidence: Screenshot of `/plan/new` showing welcome message text in the chat panel.

### VAL-CHAT-002: AI streaming response on plan request
When a user submits a message containing their CC, target school, and major (e.g. "I'm at Santa Monica College transferring to UCLA for Computer Science"), the AI response streams in token-by-token in real time. Text must begin appearing within 5 seconds of submission—not delivered all at once after full generation.
Tool: agent-browser
Evidence: Two timed screenshots: (1) mid-stream showing partial response, (2) completed response. Timestamps prove incremental delivery.

### VAL-CHAT-003: Continued chat modifies existing plan
After an initial plan is generated, the user sends a follow-up message (e.g. "Move MATH 101 to semester 2"). The AI responds with an updated plan reflecting the requested change. The visual semester grid updates to match.
Tool: agent-browser
Evidence: Screenshot of semester grid before and after the follow-up message showing the course moved to the requested semester.

### VAL-CHAT-004: Rate limit error handled gracefully
When the OpenRouter API returns a rate limit error (HTTP 429), the chat interface displays a user-friendly error message (not a raw error or stack trace) and allows the user to retry. The application does not crash or become unresponsive.
Tool: agent-browser
Evidence: Screenshot showing the graceful error message in the chat panel. No console errors indicating unhandled exceptions.

### VAL-PLAN-001: Semester grid renders after plan generation
After the AI generates a transfer plan, a visual semester grid appears showing courses organized by semester. Each course entry displays: course code, course title, units, and transfer equivalency.
Tool: agent-browser
Evidence: Screenshot of the semester grid with at least 2 semesters visible, each containing courses with all four required fields.

### VAL-PLAN-002: Semester and overall unit totals displayed
The semester grid shows a total unit count for each individual semester and an overall progress total across all semesters. Both values must be numerically consistent with the courses listed.
Tool: agent-browser
Evidence: Screenshot of semester grid. Manual count of listed course units matches the displayed semester totals and overall total.

### VAL-PLAN-003: Plan auto-saves to Supabase
After a plan is generated via the chat interface, it is automatically saved to the database without the user clicking a save button. Navigating away from `/plan/new` and returning to `/dashboard` shows the newly created plan in the list.
Tool: agent-browser
Evidence: (1) Screenshot of generated plan on `/plan/new`. (2) Navigate to `/dashboard`, screenshot showing the new plan listed with correct target school and major.

### VAL-PLAN-004: Load existing plan by ID
When a user navigates to `/plan/[id]` using a valid plan ID, the full plan loads including the semester grid and chat history. The rendered plan matches the data that was previously saved.
Tool: agent-browser
Evidence: Screenshot of `/plan/[id]` showing the loaded semester grid and chat history matching the originally generated plan.

### VAL-PLAN-005: Dashboard lists all user plans
A user with multiple saved plans navigates to `/dashboard`. All plans are listed, each displaying key metadata: target school, major, and status. Plans are distinguishable from one another.
Tool: agent-browser
Evidence: Screenshot of `/dashboard` showing at least 2 distinct plans with visible target school, major, and status for each.

### VAL-PLAN-006: Dashboard empty state
A user with zero saved plans navigates to `/dashboard`. Instead of a blank page or error, a meaningful empty state is displayed (e.g. "No plans yet" with a call-to-action to create one).
Tool: agent-browser
Evidence: Screenshot of `/dashboard` for a user with no plans, showing the empty state UI element and CTA.

### VAL-PLAN-007: Multiple plans per user
A user creates a second plan via `/plan/new` with different inputs (different target school or major). Both plans coexist in the database and appear on `/dashboard` as separate entries. Creating a new plan does not overwrite or delete the first.
Tool: agent-browser
Evidence: (1) Create first plan, note on dashboard. (2) Create second plan with different parameters. (3) Screenshot of `/dashboard` showing both plans listed independently.

### VAL-PLAN-008: Plan shows prerequisite information
Within the semester grid, courses that have prerequisites display that prerequisite information. Prerequisites listed in later semesters must reference courses appearing in earlier semesters, maintaining logical ordering.
Tool: agent-browser
Evidence: Screenshot of semester grid where at least one course shows prerequisite info, and the prerequisite course appears in a prior semester.

### VAL-PLAN-009: New plan route is accessible and functional
Navigating to `/plan/new` renders the plan creation page with both a chat input area and a plan display area. The chat input is interactive (accepts text and a submit action). No 404 or error page is shown.
Tool: agent-browser
Evidence: Screenshot of `/plan/new` showing the chat input field, submit button, and plan display area in a non-error state.

### VAL-PLAN-010: Plan edit persists on reload
A user modifies an existing plan via chat on `/plan/[id]`, then reloads the page. The modified plan (not the original version) loads, confirming that edits are persisted to the database.
Tool: agent-browser
Evidence: (1) Screenshot of plan after edit. (2) Hard reload the page. (3) Screenshot after reload showing the edit is preserved.
