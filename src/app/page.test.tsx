import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("Landing Page", () => {
  it("renders the hero headline about CareerAC", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Your Transfer Path, Perfectly Clear");
  });

  it("renders a subheadline mentioning intelligent AI planning", () => {
    render(<HomePage />);
    expect(screen.getByText(/intelligent AI/i)).toBeInTheDocument();
  });

  it("renders subheadline content about recovery suggestions", () => {
    render(<HomePage />);
    expect(screen.getByText(/if life happens/i)).toBeInTheDocument();
  });

  it("renders the how-it-works section", () => {
    render(<HomePage />);
    expect(screen.getByText(/how it works/i, { selector: 'span' })).toBeInTheDocument();
  });

  it("renders a CTA button linking to /auth/signup", () => {
    render(<HomePage />);
    const ctaLinks = screen.getAllByRole("link", { name: /get started/i });
    expect(ctaLinks[0]).toBeInTheDocument();
    expect(ctaLinks[0].getAttribute("href")).toBe("/auth/signup");
  });
});
