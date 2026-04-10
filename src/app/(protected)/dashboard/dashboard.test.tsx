import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("Dashboard Empty State", () => {
  it("renders the heading", () => {
    render(<EmptyState />);
    expect(screen.getByRole("heading", { name: /no plans yet/i })).toBeInTheDocument();
  });

  it("renders descriptive text about creating a transfer plan", () => {
    render(<EmptyState />);
    expect(screen.getByText(/transfer plan/i)).toBeInTheDocument();
  });

  it("renders a CTA link to /plan/new", () => {
    render(<EmptyState />);
    const ctaLink = screen.getByRole("link", { name: /create your first plan/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.getAttribute("href")).toBe("/plan/new");
  });

  it("renders an icon in the empty state", () => {
    render(<EmptyState />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
