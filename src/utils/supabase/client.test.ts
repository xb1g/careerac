import { describe, it, expect } from "vitest";
import { createClient } from "./client";

describe("Supabase client", () => {
  it("creates a browser client with environment variables", () => {
    // Set environment variables for testing
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = "test-key";

    const client = createClient();
    expect(client).toBeDefined();
    // Client should have auth property
    expect(client.auth).toBeDefined();
  });
});
