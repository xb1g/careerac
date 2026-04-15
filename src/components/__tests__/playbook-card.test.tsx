import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlaybookCard } from "@/components/playbook-card";

const verifiedPlaybook = {
  id: "pb-001",
  cc_name: "Santa Monica College",
  cc_abbreviation: "SMC",
  target_name: "University of California, Los Angeles",
  target_abbreviation: "UCLA",
  target_major: "Computer Science",
  transfer_year: 2023,
  outcome: "transferred",
  verification_status: "verified",
};

const unverifiedPlaybook = {
  id: "pb-002",
  cc_name: "De Anza College",
  cc_abbreviation: "DA",
  target_name: "San Jose State University",
  target_abbreviation: "SJSU",
  target_major: "Software Engineering",
  transfer_year: 2026,
  outcome: "in_progress",
  verification_status: "pending",
};

describe("PlaybookCard", () => {
  it("renders CC name", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    expect(screen.getByTestId("cc-name")).toHaveTextContent("SMC");
  });

  it("renders target school name", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    expect(screen.getByTestId("target-name")).toHaveTextContent("UCLA");
  });

  it("renders major", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    expect(screen.getByTestId("major")).toHaveTextContent("Computer Science");
  });

  it("renders transfer year", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    expect(screen.getByTestId("transfer-year")).toHaveTextContent("Transferred 2023");
  });

  it("shows verified badge for verified playbooks", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    expect(screen.getByTestId("verified-badge")).toBeInTheDocument();
    expect(screen.getByTestId("verified-badge")).toHaveTextContent("Verified Transfer Story");
  });

  it("does not show verified badge for unverified playbooks", () => {
    render(<PlaybookCard playbook={unverifiedPlaybook} />);
    expect(screen.queryByTestId("verified-badge")).not.toBeInTheDocument();
  });

  it("shows community badge for unverified playbooks", () => {
    render(<PlaybookCard playbook={unverifiedPlaybook} />);
    expect(screen.getByTestId("community-badge")).toBeInTheDocument();
    expect(screen.getByTestId("community-badge")).toHaveTextContent("Community Submission");
  });

  it("does not show community badge for verified playbooks", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    expect(screen.queryByTestId("community-badge")).not.toBeInTheDocument();
  });

  it("renders as a link to playbook detail", () => {
    render(<PlaybookCard playbook={verifiedPlaybook} />);
    const card = screen.getByTestId("playbook-card");
    expect(card.closest("a")).toHaveAttribute("href", "/playbooks/pb-001");
  });
});
