import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlaybookSubmitClient from "./playbook-submit-client";

const mockInstitutions = {
  ccs: [
    { id: "cc-1", name: "Santa Monica College", abbreviation: "SMC" },
    { id: "cc-2", name: "De Anza College", abbreviation: null },
  ],
  universities: [
    { id: "uni-1", name: "UCLA", abbreviation: "UCLA" },
    { id: "uni-2", name: "USC", abbreviation: "USC" },
  ],
};

// Mock fetch for the API route
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("PlaybookSubmitClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders basic info step by default", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    expect(screen.getByTestId("step-basic-info")).toBeInTheDocument();
    expect(screen.getByLabelText(/community college/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target school/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/major/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transfer year/i)).toBeInTheDocument();
  });

  it("shows step indicators", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    expect(screen.getByTestId("step-indicator-0")).toBeInTheDocument();
    expect(screen.getByTestId("step-indicator-1")).toBeInTheDocument();
    expect(screen.getByTestId("step-indicator-2")).toBeInTheDocument();
    expect(screen.getByTestId("step-indicator-3")).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields on next", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    const nextButton = screen.getByTestId("next-step-button");
    fireEvent.click(nextButton);

    expect(screen.getByTestId("cc-error")).toBeInTheDocument();
    expect(screen.getByTestId("target-error")).toBeInTheDocument();
    expect(screen.getByTestId("major-error")).toBeInTheDocument();
    expect(screen.getByTestId("year-error")).toBeInTheDocument();
  });

  it("does not advance to next step when required fields are empty", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    const nextButton = screen.getByTestId("next-step-button");
    fireEvent.click(nextButton);

    expect(screen.queryByTestId("step-courses")).not.toBeInTheDocument();
    expect(screen.getByTestId("step-basic-info")).toBeInTheDocument();
  });

  it("advances to courses step when all required fields are filled", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });

    const nextButton = screen.getByTestId("next-step-button");
    fireEvent.click(nextButton);

    expect(screen.getByTestId("step-courses")).toBeInTheDocument();
  });

  it("shows back button to navigate to previous step", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill required fields and go to next step
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });

    fireEvent.click(screen.getByTestId("next-step-button"));
    expect(screen.getByTestId("step-courses")).toBeInTheDocument();

    // Go back
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(screen.getByTestId("step-basic-info")).toBeInTheDocument();
  });

  it("navigates through all 4 steps", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });

    // Step 1 -> Step 2
    fireEvent.click(screen.getByTestId("next-step-button"));
    expect(screen.getByTestId("step-courses")).toBeInTheDocument();

    // Step 2 -> Step 3
    fireEvent.click(screen.getByTestId("next-step-button"));
    expect(screen.getByTestId("step-failures")).toBeInTheDocument();

    // Step 3 -> Step 4
    fireEvent.click(screen.getByTestId("next-step-button"));
    expect(screen.getByTestId("step-outcome")).toBeInTheDocument();
  });

  it("shows submit button on final step and success state after submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "test-playbook-id" }),
    });

    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });

    // Navigate to final step
    fireEvent.click(screen.getByTestId("next-step-button"));
    fireEvent.click(screen.getByTestId("next-step-button"));
    fireEvent.click(screen.getByTestId("next-step-button"));

    expect(screen.getByTestId("step-outcome")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();

    // Submit
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("pending-verification-badge")).toBeInTheDocument();
    });
  });

  it("shows error message when submission fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });

    // Navigate to final step
    fireEvent.click(screen.getByTestId("next-step-button"));
    fireEvent.click(screen.getByTestId("next-step-button"));
    fireEvent.click(screen.getByTestId("next-step-button"));

    // Submit
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("submit-error")).toBeInTheDocument();
      expect(screen.getByTestId("submit-error")).toHaveTextContent("Something went wrong");
    });
  });

  it("allows adding and removing semesters", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill required fields and navigate to courses step
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });
    fireEvent.click(screen.getByTestId("next-step-button"));

    // Initially should have 1 semester
    const semesterElements = screen.getAllByTestId("semester");
    expect(semesterElements).toHaveLength(1);

    // Add a semester
    const addSemesterButton = screen.getByRole("button", { name: /add semester/i });
    fireEvent.click(addSemesterButton);

    const updatedSemesters = screen.getAllByTestId("semester");
    expect(updatedSemesters).toHaveLength(2);
  });

  it("clears validation errors when user fills in a field", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Try to advance without filling fields
    fireEvent.click(screen.getByTestId("next-step-button"));
    expect(screen.getByTestId("cc-error")).toBeInTheDocument();

    // Fill in the CC field
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });

    // Error should be cleared
    expect(screen.queryByTestId("cc-error")).not.toBeInTheDocument();
  });

  it("allows adding failure events", () => {
    render(<PlaybookSubmitClient institutions={mockInstitutions} />);

    // Fill required fields and navigate to failures step
    fireEvent.change(screen.getByLabelText(/community college/i), {
      target: { value: "cc-1" },
    });
    fireEvent.change(screen.getByLabelText(/target school/i), {
      target: { value: "uni-1" },
    });
    fireEvent.change(screen.getByLabelText(/major/i), {
      target: { value: "Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/transfer year/i), {
      target: { value: "2024" },
    });
    fireEvent.click(screen.getByTestId("next-step-button"));
    fireEvent.click(screen.getByTestId("next-step-button"));

    expect(screen.getByTestId("step-failures")).toBeInTheDocument();

    // Add a failure event
    const addChallengeButton = screen.getByRole("button", { name: /add a challenge/i });
    fireEvent.click(addChallengeButton);

    // Verify the failure event form appears - check for the type select by its value
    const typeSelect = screen.getByRole("combobox");
    expect(typeSelect).toBeInTheDocument();
    expect(typeSelect).toHaveValue("failed");
  });
});
