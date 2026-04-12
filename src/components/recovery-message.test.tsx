import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecoveryMessage, { RecoveryAlternative } from "./recovery-message";

const mockAlternatives: RecoveryAlternative[] = [
  {
    code: "CS 2A",
    title: "Intro to Programming",
    units: 4,
    transferEquivalency: "UCLA COM SCI 35A",
    reasoning: "This course covers similar material and fulfills the same requirement.",
  },
  {
    code: "CS 2B",
    title: "Object-Oriented Programming",
    units: 4,
    transferEquivalency: "UCLA COM SCI 35B",
    reasoning: "Good alternative with slightly different focus but same transfer credit.",
  },
];

const defaultProps = {
  failedCourseCode: "CS 2",
  failedCourseTitle: "Intro to CS II",
  status: "failed" as const,
  dependentCourses: ["CS 3 (Data Structures) in semester 3"],
  alternatives: mockAlternatives,
  noAlternatives: false,
  onAcceptAlternative: vi.fn(),
  isAccepting: false,
};

describe("RecoveryMessage", () => {
  it("renders failed course information", () => {
    render(<RecoveryMessage {...defaultProps} />);

    expect(screen.getByText(/Course failed:/)).toBeInTheDocument();
    expect(screen.getByText("CS 2")).toBeInTheDocument();
    expect(screen.getByText(/Intro to CS II/)).toBeInTheDocument();
  });

  it("renders cancelled course with different styling", () => {
    render(<RecoveryMessage {...defaultProps} status="cancelled" />);

    expect(screen.getByText(/Course cancelled:/)).toBeInTheDocument();
  });

  it("renders waitlisted course with uncertainty message", () => {
    render(<RecoveryMessage {...defaultProps} status="waitlisted" />);

    expect(screen.getByText(/Course waitlisted:/)).toBeInTheDocument();
    expect(
      screen.getByText(/You might still get in, but let's prepare a backup plan/)
    ).toBeInTheDocument();
  });

  it("renders dependent courses list", () => {
    render(<RecoveryMessage {...defaultProps} />);

    const list = screen.getByTestId("dependent-courses-list");
    expect(list).toBeInTheDocument();
    expect(screen.getByText("CS 3 (Data Structures) in semester 3")).toBeInTheDocument();
  });

  it("hides dependent courses when list is empty", () => {
    render(<RecoveryMessage {...defaultProps} dependentCourses={[]} />);

    expect(screen.queryByTestId("dependent-courses-list")).not.toBeInTheDocument();
  });

  it("renders alternative suggestions with accept buttons", () => {
    render(<RecoveryMessage {...defaultProps} />);

    const alternativesContainer = screen.getByTestId("recovery-alternatives");
    expect(alternativesContainer).toBeInTheDocument();

    expect(screen.getByTestId("alternative-CS 2A")).toBeInTheDocument();
    expect(screen.getByTestId("alternative-CS 2B")).toBeInTheDocument();

    expect(screen.getByTestId("accept-CS 2A")).toBeInTheDocument();
    expect(screen.getByTestId("accept-CS 2B")).toBeInTheDocument();
  });

  it("shows alternative details correctly", () => {
    render(<RecoveryMessage {...defaultProps} />);

    expect(screen.getByText("CS 2A — Intro to Programming")).toBeInTheDocument();
    expect(screen.getByText("4 units → UCLA COM SCI 35A")).toBeInTheDocument();
  });

  it("calls onAcceptAlternative when accept button is clicked", () => {
    const handleAccept = vi.fn();
    render(<RecoveryMessage {...defaultProps} onAcceptAlternative={handleAccept} />);

    fireEvent.click(screen.getByTestId("accept-CS 2A"));

    expect(handleAccept).toHaveBeenCalledWith(mockAlternatives[0]);
  });

  it("shows 'Added' state after accepting an alternative", () => {
    render(<RecoveryMessage {...defaultProps} />);

    fireEvent.click(screen.getByTestId("accept-CS 2A"));

    expect(screen.getByText("✓ Added")).toBeInTheDocument();
    expect(screen.queryByTestId("accept-CS 2A")).not.toBeInTheDocument();
  });

  it("shows 'Adding...' while accepting", () => {
    render(<RecoveryMessage {...defaultProps} isAccepting />);

    const addingButtons = screen.getAllByText("Adding...");
    expect(addingButtons).toHaveLength(2); // Both accept buttons show "Adding..."
  });

  it("shows no alternatives message when noAlternatives is true", () => {
    render(<RecoveryMessage {...defaultProps} alternatives={[]} noAlternatives />);

    const noAlternativesMsg = screen.getByTestId("no-alternatives-message");
    expect(noAlternativesMsg).toBeInTheDocument();
    expect(screen.getByText("No alternative courses found")).toBeInTheDocument();
    expect(
      screen.getByText(/consulting with an academic counselor/)
    ).toBeInTheDocument();
  });

  it("does not render accept buttons when onAcceptAlternative is not provided", () => {
    render(<RecoveryMessage {...defaultProps} onAcceptAlternative={undefined} />);

    expect(screen.queryByTestId("accept-CS 2A")).not.toBeInTheDocument();
    expect(screen.queryByTestId("accept-CS 2B")).not.toBeInTheDocument();
  });
});
