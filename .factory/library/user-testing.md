# User Testing

Testing surface, required testing skills/tools, and resource cost classification.

---

## Validation Surface

### Web UI (Primary)
- **URL:** `http://localhost:3000`
- **Tool:** `agent-browser`
- **Pages to test:**
  - `/` — Landing page (public)
  - `/auth/signin`, `/auth/signup` — Auth pages (public)
  - `/dashboard` — User's plans (protected)
  - `/plan/new` — New plan with AI chat (protected)
  - `/plan/[id]` — Plan view/edit (protected)
  - `/playbooks` — Browse playbooks (semi-public, browsing public, submission protected)
  - `/playbooks/submit` — Playbook submission (protected)
  - `/playbooks/[id]` — Playbook detail (public)

### API Routes
- **URL:** `http://localhost:3000/api/chat`
- **Tool:** `curl`
- **Endpoints:** POST `/api/chat` (streaming AI chat)

## Auth Setup for Testing

- Use Supabase email auth (no email confirmation in development — configure in Supabase dashboard)
- Create test accounts programmatically or via the signup form
- Test credentials: use `test+{uuid}@example.com` pattern for isolation

## Seed Data Requirements

- 5-10 CC/university paths seeded in database
- At least 2 verified playbooks and 1 unverified playbook for testing
- Course catalog with prerequisite relationships
- Articulation agreements linking CC courses to university courses

## Validation Concurrency

### agent-browser
- **Max concurrent validators:** 3
- **Rationale:** 32GB RAM, 10 cores, but high base CPU/memory load from desktop apps. Each agent-browser instance uses ~300MB. Next.js dev server ~300-500MB. 3 concurrent = ~1.4GB total, well within headroom. Conservative due to observed high CPU load averages (>100).

## Known Testing Constraints

- OpenRouter free tier: 20 req/min, 50 req/day — AI-dependent tests must be rationed
- AI responses are non-deterministic — assertions about AI content should check for presence of key information, not exact text
- Streaming tests need timing-aware assertions (screenshots at specific intervals)
