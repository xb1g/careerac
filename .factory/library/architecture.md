# Architecture

## System Overview

CareerAC is a Next.js 15 App Router application with a chat-first AI interface for community college transfer planning. The system has four main domains: Authentication, Plan Generation, Failure Recovery, and Community Playbooks.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (Postgres + Auth via `@supabase/ssr`)
- **AI:** OpenRouter (`google/gemma-4-31b-it:free`) via `@openrouter/ai-sdk-provider` + Vercel AI SDK (`ai`, `@ai-sdk/react`)
- **Testing:** Vitest + React Testing Library

## Component Architecture

```
app/
├── (public)/              # Public routes (no auth required)
│   ├── page.tsx           # Landing page with hero + CTA
│   └── auth/
│       ├── signin/page.tsx
│       ├── signup/page.tsx
│       └── callback/route.ts  # Auth callback handler
├── (protected)/           # Routes requiring auth (middleware-enforced)
│   ├── layout.tsx         # App shell: header nav + sidebar
│   ├── dashboard/page.tsx # Lists user's plans, empty state, CTA to new plan
│   ├── plan/
│   │   ├── new/page.tsx   # Chat interface + plan display area
│   │   └── [id]/page.tsx  # View/edit existing plan
│   └── playbooks/
│       ├── page.tsx       # Browse/filter playbooks
│       ├── submit/page.tsx # Multi-step submission form
│       └── [id]/page.tsx  # Playbook detail view
├── api/
│   └── chat/route.ts      # POST: streaming AI chat endpoint (OpenRouter)
├── layout.tsx              # Root layout
└── not-found.tsx           # Custom 404 page
```

## Data Model

### Core Tables (Supabase Postgres, RLS enabled on all)

**institutions** — Community colleges and universities
- id, name, type (cc|university), state, city, abbreviation

**courses** — Course catalog entries
- id, institution_id, code, title, units, description

**articulation_agreements** — Transfer equivalencies between CC and university courses
- id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes

**prerequisites** — Course prerequisite relationships
- id, course_id, prerequisite_course_id, is_corequisite (boolean)

**profiles** — User profiles (auto-created on signup via trigger)
- id (refs auth.users), email, full_name, created_at

**transfer_plans** — Saved transfer plans
- id, user_id, title, cc_institution_id, target_institution_id, target_major, status (draft|active|completed), plan_data (JSONB — semester array with courses), chat_history (JSONB — message array), created_at, updated_at

**plan_courses** — Individual course entries within a plan (denormalized for status tracking)
- id, plan_id, course_id, semester_number, status (planned|in_progress|completed|cancelled|waitlisted|failed), alternative_for (self-ref for recovery alternatives), created_at, updated_at

**failure_events** — Recorded course failures
- id, plan_id, plan_course_id, failure_type (cancelled|waitlisted|failed), resolution (text), resolved_at, created_at

**playbooks** — Community transfer playbooks
- id, user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome (transferred|in_progress|changed_direction), verification_status (pending|verified|rejected), playbook_data (JSONB — semesters with courses and failure events), created_at

## Data Flow

### Plan Generation Flow
1. User types in chat → message sent to `/api/chat` route
2. Route handler builds context: articulation data for CC+university+major, verified playbooks, existing plan state
3. Context + user message sent to OpenRouter via `streamText()`
4. AI generates structured plan (semester-by-semester with course codes, units, prereqs)
5. Streamed response rendered in chat + parsed into visual semester grid
6. Plan auto-saved to `transfer_plans` table (JSONB plan_data + chat_history)
7. Individual courses upserted into `plan_courses` for status tracking

### Failure Recovery Flow
1. User clicks course → status menu → selects "failed"/"cancelled"/"waitlisted"
2. Status update saved to `plan_courses`, failure event created in `failure_events`
3. System message auto-injected into chat: "Course X was marked as {status}"
4. `/api/chat` called with system context: failed course, dependencies, available alternatives
5. AI analyzes impact and suggests alternatives from articulation data
6. User accepts alternative → new `plan_course` created, `plan_data` JSONB updated
7. Visual plan re-renders with updated courses

### Playbook Integration with AI
- When generating plans or recovery suggestions, the system queries `playbooks` table for matching CC+university+major with `verification_status = 'verified'` and `outcome = 'transferred'`
- Verified playbook data injected into AI system prompt as additional context
- Unverified playbooks (in_progress, changed_direction) are NEVER included in AI context

## Key Invariants

1. **Prerequisite ordering:** No course in a plan may be scheduled before its prerequisites
2. **RLS isolation:** Users can only access their own plans and profile data; playbooks are readable by all but writable only by owner
3. **Verified-only AI context:** Only playbooks with `verification_status = 'verified'` AND `outcome = 'transferred'` are included in AI plan generation context
4. **Session security:** Server-side auth uses `getUser()` (validates JWT), never `getSession()` (reads unvalidated cookies)
5. **API key isolation:** `OPENROUTER_API_KEY` is server-side only, never exposed to client

## AI System Prompt Strategy

The AI operates with a structured system prompt that includes:
- Role definition (transfer planning assistant)
- Available articulation data for the student's CC+university+major combination
- Prerequisite DAG for relevant courses
- Current plan state (if editing/recovering)
- Verified playbook insights (if any match)
- Output format instructions (structured JSON for plan data, natural language for explanations)
- Guardrails: stay on topic, don't fabricate courses, admit when no data available
