import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("Landing Page", () => {
  it("renders the hero headline about CareerAC", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/careerac/i);
  });

  it("renders a subheadline mentioning AI-powered transfer planning", () => {
    render(<HomePage />);
    expect(screen.getByText(/ai-powered/i)).toBeInTheDocument();
  });

  it("renders subheadline content about failure recovery", () => {
    render(<HomePage />);
    expect(screen.getByText(/recovery/i)).toBeInTheDocument();
  });

  it("renders subheadline content about community playbooks", () => {
    render(<HomePage />);
    expect(screen.getByText(/playbook/i)).toBeInTheDocument();
  });

  it("renders a CTA button linking to /auth/signup", () => {
    render(<HomePage />);
    const ctaLink = screen.getByRole("link", { name: /get started/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.getAttribute("href")).toBe("/auth/signup");
  });
});
