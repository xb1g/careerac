---
name: fullstack-worker
description: Full-stack Next.js worker for CareerAC features spanning UI, API routes, database, and AI integration.
---

# Fullstack Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features that involve any combination of:
- Next.js pages/components (React, Tailwind CSS)
- API routes (Next.js Route Handlers)
- Supabase database operations (queries, mutations, RLS policies)
- Supabase Auth integration
- OpenRouter AI integration (Vercel AI SDK)
- Data seeding and migrations

## Required Skills

- **agent-browser**: Use for manual verification of UI features. Invoke after implementing any user-facing page or component to verify it renders and functions correctly in the browser.

## Work Procedure

### 1. Understand the Feature

Read the feature description, preconditions, expectedBehavior, and verificationSteps carefully. Read `mission.md` for full context. Read `.factory/library/architecture.md` for system design. Read `.factory/library/environment.md` for env vars and external dependencies.

### 2. Plan the Implementation

Before writing code, identify:
- Which files need to be created or modified
- Database changes needed (new tables, columns, RLS policies)
- API routes needed
- Components needed
- How this feature integrates with existing code

### 3. Write Tests First (TDD)

Write failing tests BEFORE implementation:
- Create test file(s) in `__tests__/` or co-located with the source
- Use Vitest + React Testing Library
- Cover: happy path, error cases, edge cases from expectedBehavior
- Run tests to confirm they fail: `pnpm vitest run --reporter=verbose`

### 4. Implement

- Follow existing code patterns and conventions
- Use Tailwind CSS for styling (no custom CSS unless necessary)
- Use the Supabase client helpers in `utils/supabase/` (server.ts for server components/routes, client.ts for client components)
- For AI features: use `@openrouter/ai-sdk-provider` with `streamText` from `ai` package
- For database migrations: apply via Supabase MCP or create SQL files in `supabase/migrations/`
- Ensure all environment variables are read from `process.env`, never hardcoded
- Never expose `OPENROUTER_API_KEY` to the client

### 5. Make Tests Pass

- Run `pnpm vitest run --reporter=verbose`
- Fix implementation until all tests pass
- Do not modify tests to make them pass — fix the implementation

### 6. Run Validators

```bash
pnpm tsc --noEmit     # TypeScript check
pnpm next lint        # ESLint
pnpm vitest run       # All tests
```

Fix any issues before proceeding.

### 7. Manual Verification

Start the dev server and verify in the browser using agent-browser:
- Navigate to the relevant pages
- Test all user interactions from expectedBehavior
- Check responsive layout (desktop + mobile viewport)
- Verify error states render correctly
- Check that data persists (reload page, verify state)

For each manual check, record:
- What action was taken
- What was observed
- Whether it matched expected behavior

### 8. Commit

Commit with a descriptive message covering what was implemented.

## Example Handoff

```json
{
  "salientSummary": "Implemented email auth flow (signup, signin, signout) with Supabase Auth. Created /auth/signin and /auth/signup pages with form validation, /auth/callback route handler, and middleware for session management. Ran vitest (6 passing), typecheck clean, lint clean. Verified signup → redirect to dashboard, signin with valid/invalid credentials, signout → redirect to landing, protected route redirect via agent-browser.",
  "whatWasImplemented": "Email authentication: signup page with email/password form and client-side validation, signin page with error handling for invalid credentials, signout via header button, /auth/callback route handler for session exchange, middleware.ts for session refresh and route protection. Supabase SSR clients (server.ts, client.ts) configured.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "pnpm vitest run --reporter=verbose", "exitCode": 0, "observation": "6 tests passing: signup form validation (3), signin error handling (2), signout redirect (1)" },
      { "command": "pnpm tsc --noEmit", "exitCode": 0, "observation": "No type errors" },
      { "command": "pnpm next lint", "exitCode": 0, "observation": "No lint warnings" }
    ],
    "interactiveChecks": [
      { "action": "Navigate to /auth/signup, fill in test@example.com + password, submit", "observed": "Account created, redirected to /dashboard with email in header" },
      { "action": "Click signout button in header", "observed": "Redirected to /, header shows no user info" },
      { "action": "Navigate to /dashboard while logged out", "observed": "Redirected to /auth/signin" },
      { "action": "Sign in with wrong password", "observed": "Error message: 'Invalid login credentials' displayed, form remains usable" },
      { "action": "Submit signup with empty fields", "observed": "Inline validation errors: 'Email is required', 'Password is required'" }
    ]
  },
  "tests": {
    "added": [
      { "file": "__tests__/auth/signup.test.tsx", "cases": [
        { "name": "renders signup form with email and password fields", "verifies": "Form structure" },
        { "name": "shows validation error for empty email", "verifies": "Client-side validation" },
        { "name": "shows validation error for short password", "verifies": "Password length validation" }
      ]},
      { "file": "__tests__/auth/signin.test.tsx", "cases": [
        { "name": "renders signin form", "verifies": "Form structure" },
        { "name": "displays error on invalid credentials", "verifies": "Error handling" }
      ]}
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Supabase project is inaccessible or credentials are invalid
- OpenRouter API key is invalid or model is unavailable
- Feature requires database tables/columns that don't exist and weren't in preconditions
- Feature requirements are ambiguous or contradictory
- Existing code has bugs that block this feature
- Cannot install required dependencies
