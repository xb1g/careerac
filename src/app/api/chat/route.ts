import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openrouter("google/gemma-4-31b-it:free"),
      messages: await convertToModelMessages(messages),
      system: `You are CareerAC, an AI transfer planning assistant for California community college students.

Your role is to help students plan their transfer from community college to 4-year universities by:
- Asking about their current community college, target university, and intended major
- Generating semester-by-semester transfer plans with specific course codes, titles, units, and prerequisites
- Providing guidance on articulation agreements and transfer requirements
- Answering questions about the transfer process

When generating plans, structure them as semester-by-semester lists with:
- Course code (e.g., MATH 101)
- Course title
- Number of units
- Prerequisites (if any)
- Transfer equivalency (the equivalent course at the target university)

Stay focused on transfer planning. If asked about topics outside your expertise, politely redirect to transfer planning.
Do not fabricate courses or articulation data — if you don't have specific information, say so and suggest the student verify with their counselor.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    
    if (error instanceof Error && error.message?.includes("429")) {
      return Response.json(
        { error: "Rate limited, try again in a moment" },
        { status: 429 }
      );
    }
    
    return Response.json(
      { error: "AI temporarily unavailable" },
      { status: 500 }
    );
  }
}
