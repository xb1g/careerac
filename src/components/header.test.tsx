import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./header";
import { vi } from "vitest";

// Mock next/navigation - must be before imports
const mockUsePathname = vi.fn(() => "/dashboard");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock the signout server action
vi.mock("@/app/auth/actions", () => ({
  signout: vi.fn(),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/dashboard");
  });

  it("renders the CareerAC logo", () => {
    render(<Header userEmail={null} />);
    expect(screen.getByText("CareerAC")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Header userEmail={null} />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /new plan/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /playbooks/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my courses/i })).toBeInTheDocument();
  });

  it("highlights the active route (Dashboard)", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    render(<Header userEmail={null} />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink.className).toContain("text-zinc-900");
  });

  it("highlights the active route (New Plan)", () => {
    mockUsePathname.mockReturnValue("/plan/new");

    render(<Header userEmail={null} />);
    const newPlanLink = screen.getByRole("link", { name: /new plan/i });
    expect(newPlanLink.className).toContain("text-zinc-900");
  });

  it("highlights the active route (Playbooks)", () => {
    mockUsePathname.mockReturnValue("/playbooks");

    render(<Header userEmail={null} />);
    const playbooksLink = screen.getByRole("link", { name: /playbooks/i });
    expect(playbooksLink.className).toContain("text-zinc-900");
  });

  it("highlights playbooks for sub-routes", () => {
    mockUsePathname.mockReturnValue("/playbooks/some-id");

    render(<Header userEmail={null} />);
    const playbooksLink = screen.getByRole("link", { name: /playbooks/i });
    expect(playbooksLink.className).toContain("text-zinc-900");
  });

  it("does not highlight inactive links", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    render(<Header userEmail={null} />);
    const newPlanLink = screen.getByRole("link", { name: /new plan/i });
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });

    // Active link should have a different appearance than inactive link
    // Active: "text-zinc-900 dark:text-white" (base color)
    // Inactive: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
    expect(dashboardLink.className).not.toBe(newPlanLink.className);
    // Inactive should contain text-zinc-600
    expect(newPlanLink.className).toContain("text-zinc-600");
  });

  it("displays user email when provided", () => {
    render(<Header userEmail="test@example.com" />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("does not display user email when null", () => {
    render(<Header userEmail={null} />);
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it("renders the sign out button", () => {
    render(<Header userEmail={null} />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("renders mobile menu button", () => {
    render(<Header userEmail={null} />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header userEmail={null} />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });

    // Mobile menu should not be visible initially
    expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();

    // Open menu
    await user.click(menuButton);
    expect(screen.getByRole("navigation", { name: /mobile navigation/i })).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-label", "Close menu");

    // Close menu
    await user.click(menuButton);
    expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it("mobile menu contains all nav links", async () => {
    const user = userEvent.setup();
    render(<Header userEmail={null} />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    const mobileNav = screen.getByRole("navigation", { name: /mobile navigation/i });
    expect(within(mobileNav).getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /new plan/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /playbooks/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /my courses/i })).toBeInTheDocument();
  });

  it("displays user email in mobile menu when provided", async () => {
    const user = userEvent.setup();
    render(<Header userEmail="test@example.com" />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    expect(screen.getAllByText("test@example.com").length).toBeGreaterThan(0);
  });
});
