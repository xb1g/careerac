# Conventions

This document captures coding patterns and conventions discovered during development.

## Authentication & Protected Routes

### Middleware-based Route Protection

The project uses a consistent pattern for protected routes via middleware at `src/utils/supabase/middleware.ts`:

```typescript
// Protected route prefixes - any URL starting with these requires auth
const protectedPrefixes = ['/dashboard', '/plan/', '/playbooks/submit'];

// Check if current path requires authentication
const isProtectedPath = protectedPrefixes.some(prefix => 
  request.nextUrl.pathname.startsWith(prefix)
);

// Redirect unauthenticated users with redirectTo for post-auth return
if (isProtectedPath && !user) {
  const redirectUrl = new URL('/auth/signin', request.url);
  redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}
```

Key points:
- Protected routes are defined by prefixes, not exact matches
- Redirects include `redirectTo` query param for post-authentication return navigation
- The middleware handles both the protection check and the redirect logic

## AI SDK Patterns

### Passing Custom Context to API Routes

When using `@ai-sdk/react`'s `useChat()` hook with custom context data:

```typescript
import { DefaultChatTransport } from 'ai';

// In your Chat component
const transport = new DefaultChatTransport({
  url: '/api/chat',
  body: {
    // Custom data passed to API route
    planContext: {
      ccInstitutionId,
      targetInstitutionId,
      targetMajor,
    }
  }
});

const { messages, input, handleSubmit } = useChat({ transport });
```

In the API route, access the custom data via the request body:

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  const { planContext } = body;
  // Use planContext to filter queries, etc.
}
```

## Data Fetching Patterns

### Parallel Data Fetching

For aggregating multiple data sources before building responses, use `Promise.all`:

```typescript
// Fetch multiple context sources in parallel
const [articulationData, prerequisiteData, verifiedPlaybooksContext] = await Promise.all([
  getArticulationData(ccId, universityId, major),
  getPrerequisiteData(courseIds),
  getVerifiedPlaybooksContext(ccId, universityId, major),
]);
```

This is the established pattern throughout the codebase for AI context building.

## Supabase Patterns

### Server-side Auth Validation

Always use `getUser()` to validate authentication server-side:

```typescript
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  
  // Validates JWT - secure for API routes
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Process authenticated request...
}
```

Never use `getSession()` for server-side auth validation as it reads unvalidated cookies.

## JSONB Data Structures

### Playbook Data Format

Playbooks store their data as JSONB with this structure:

```typescript
interface PlaybookData {
  semesters: Array<{
    semesterNumber: number;
    courses: Array<{
      code: string;
      title: string;
      units: number;
      grade?: string;
    }>;
  }>;
  failure_events?: Array<{
    courseCode: string;
    failureType: 'cancelled' | 'failed' | 'waitlisted';
    resolution?: string;
  }>;
}
```

When working with playbook data, respect these field names and structures.
