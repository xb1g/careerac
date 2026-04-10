# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required env vars, external API keys/services, dependency quirks, platform-specific notes.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Required Environment Variables

### `.env.local` (git-ignored)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Supabase publishable key (sb_publishable_* format)
- `OPENROUTER_API_KEY` — OpenRouter API key (server-side only, never expose to client)

## External Dependencies

### Supabase (Cloud)
- Project: `rypjlvcazpgeompyebbw`
- Region: Unknown (cloud-hosted)
- Auth: Email only (Google OAuth deferred)
- Database: Postgres with RLS

### OpenRouter
- Model: `google/gemma-4-31b-it:free`
- Rate limits: 20 req/min, 50 req/day (1,000/day with $10 credits)
- Base URL: `https://openrouter.ai/api/v1` (handled by SDK)
- Context window: 256K tokens, max output: 32K tokens
- Supports: function calling, streaming, reasoning

## Platform Notes

- Node.js v25.9.0, pnpm v10.30.2
- macOS, 32GB RAM, 10 cores
- No Docker required
- Supabase CLI not required (using cloud migrations via MCP or dashboard)
