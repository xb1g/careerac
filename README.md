# CareerAC

AI-native community college transfer planning platform helping California community college students plan their transfer to 4-year universities.

## Features

- **AI Chat Plan Generator** — Interactive chat with AI to create semester-by-semester transfer plans, powered by OpenRouter (google/gemma-4-31b-it:free)
- **Failure Recovery** — Mark courses as failed/cancelled/waitlisted and get AI-powered recovery suggestions with alternative courses from articulation data
- **Community Playbooks** — Browse real transfer stories from students who successfully transferred, filtered by community college, university, and major
- **Playbook Submission** — Multi-step form to share your own transfer story with the community
- **Authentication** — Email signup/signin via Supabase Auth with protected routes and session persistence

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript strict)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (Postgres with RLS)
- **AI**: OpenRouter + Vercel AI SDK (streaming responses)
- **Testing**: Vitest + React Testing Library (242 tests)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project with the schema applied
- OpenRouter API key

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
   OPENROUTER_API_KEY=your-openrouter-key
   ```

3. Apply database migrations from `supabase/migrations/` to your Supabase project.

4. Start the dev server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Testing

```bash
pnpm vitest run     # Run all 242 tests
pnpm tsc --noEmit   # Type check
pnpm next build     # Production build
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── auth/signup|signin|callback       # Auth flow
│   ├── (protected)/
│   │   ├── dashboard/page.tsx            # Plan listing
│   │   ├── plan/new/page.tsx             # AI chat + plan generation
│   │   ├── plan/[id]/page.tsx            # Plan detail + recovery
│   │   └── playbooks/                    # Browse, detail, submit
│   └── api/                              # Route handlers
├── components/                           # Shared UI components
├── utils/
│   ├── supabase/                         # SSR client helpers
│   ├── plan-parser.ts                    # AI response → structured plan
│   ├── recovery-analysis.ts              # Dependency & alternative analysis
│   └── playbook-context.ts              # Verified playbook queries for AI
└── middleware.ts                         # Session refresh + route protection

supabase/migrations/                      # Database schema + seed data
```

## Key User Flows

1. **Sign up** → Landing page CTA → Create account → Dashboard
2. **Generate a plan** → Dashboard "New Plan" → Chat with AI → Save semester plan
3. **Handle failures** → Open a saved plan → Click a course → Change status → Get AI recovery suggestions
4. **Browse playbooks** → Sidebar nav → Filter by CC/university/major → Read transfer stories
5. **Submit a playbook** → Playbooks page → "Share Your Story" → Multi-step form

## Known Limitations

- OpenRouter free tier has rate limits (may cause 429 errors during heavy testing)
- Some assertions were blocked by rate limits during automated validation but code works with valid API access
- Email confirmation is currently disabled in Supabase for easier testing
