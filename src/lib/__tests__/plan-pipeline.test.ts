import { describe, it, expect, vi, beforeEach } from "vitest";
import type { UIMessage } from "ai";
import { PlanGenerationPipeline } from "@/lib/plan-pipeline";

const mockGetArticulationContext = vi.fn();
const mockGetPrerequisiteContext = vi.fn();
const mockGetVerifiedPlaybooksContext = vi.fn();
const mockBuildRecoveryContext = vi.fn();
const mockBuildSystemPrompt = vi.fn();
const mockConvertToAnthropicMessages = vi.fn();
const mockGenerateTextFromMiniMax = vi.fn();
const mockParsePlanFromAIResponse = vi.fn();

vi.mock("@/lib/context/articulation", () => ({
  getArticulationContext: mockGetArticulationContext,
  getPrerequisiteContext: mockGetPrerequisiteContext,
}));

vi.mock("@/lib/context/recovery", () => ({
  buildRecoveryContext: mockBuildRecoveryContext,
}));

vi.mock("@/utils/playbook-context", () => ({
  getVerifiedPlaybooksContext: mockGetVerifiedPlaybooksContext,
}));

vi.mock("@/lib/prompt-builder", () => ({
  buildSystemPrompt: mockBuildSystemPrompt,
}));

vi.mock("@/lib/ai-stream", () => ({
  convertToAnthropicMessages: mockConvertToAnthropicMessages,
  generateTextFromMiniMax: mockGenerateTextFromMiniMax,
  streamFromMiniMax: vi.fn(),
}));

vi.mock("@/utils/plan-parser", () => ({
  parsePlanFromAIResponse: mockParsePlanFromAIResponse,
}));

describe("PlanGenerationPipeline.generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetArticulationContext.mockResolvedValue({ context: "articulation" });
    mockGetPrerequisiteContext.mockResolvedValue("prerequisites");
    mockGetVerifiedPlaybooksContext.mockResolvedValue("playbooks");
    mockBuildRecoveryContext.mockResolvedValue("recovery");
    mockBuildSystemPrompt.mockReturnValue("SYSTEM PROMPT");
    mockConvertToAnthropicMessages.mockReturnValue([
      { role: "user", content: [{ type: "text", text: "Generate it" }] },
    ]);
    mockGenerateTextFromMiniMax.mockResolvedValue("```json\n{}\n```");
    mockParsePlanFromAIResponse.mockReturnValue({
      ccName: "De Anza College",
      targetUniversity: "UCLA",
      targetMajor: "Computer Science",
      semesters: [
        { number: 1, label: "Fall 2026", courses: [], totalUnits: 0 },
      ],
      totalUnits: 0,
    });
  });

  it("prepares context once and returns raw text with the parsed plan", async () => {
    const messages: UIMessage[] = [
      {
        id: "user-1",
        role: "user",
        parts: [{ type: "text", text: "Generate my plan" }],
      } as unknown as UIMessage,
    ];

    const result = await PlanGenerationPipeline.generate(
      {
        messages,
        planContext: {
          ccInstitutionId: "cc-1",
          targetInstitutionId: "uni-1",
          targetMajor: "Computer Science",
        },
      },
      {
        transcriptData: {
          institution: "De Anza College",
          courses: [],
          totalUnitsCompleted: 30,
          totalUnitsInProgress: 0,
        },
        maxCreditsPerSemester: 12,
        hasTargetSchool: false,
        recoveryContext: {
          failedCourseCode: "MATH 1A",
          failedCourseTitle: "Calculus",
          status: "failed",
          planData: null,
        },
      },
    );

    expect(mockGetArticulationContext).toHaveBeenCalledWith(
      {
        ccInstitutionId: "cc-1",
        targetInstitutionId: "uni-1",
        targetMajor: "Computer Science",
      },
      false,
    );
    expect(mockBuildSystemPrompt).toHaveBeenCalledWith(
      expect.objectContaining({
        articulationContext: "articulation",
        prerequisiteData: "prerequisites",
        playbookContext: "playbooks",
        maxCreditsPerSemester: 12,
        hasTargetSchool: false,
        recoveryPrompt: "recovery",
      }),
    );
    expect(mockConvertToAnthropicMessages).toHaveBeenCalledWith(messages);
    expect(mockGenerateTextFromMiniMax).toHaveBeenCalledWith("SYSTEM PROMPT", [
      { role: "user", content: [{ type: "text", text: "Generate it" }] },
    ]);
    expect(mockParsePlanFromAIResponse).toHaveBeenCalledWith("```json\n{}\n```");
    expect(result).toEqual({
      rawText: "```json\n{}\n```",
      parsedPlan: {
        ccName: "De Anza College",
        targetUniversity: "UCLA",
        targetMajor: "Computer Science",
        semesters: [
          { number: 1, label: "Fall 2026", courses: [], totalUnits: 0 },
        ],
        totalUnits: 0,
      },
    });
  });
});
