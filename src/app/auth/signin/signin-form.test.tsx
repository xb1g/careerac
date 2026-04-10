import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SigninForm from "./signin-form";

// Mock the signin action
vi.mock("../actions", () => ({
  signin: vi.fn(),
}));

import { signin } from "../actions";

describe("SigninForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields with submit button", () => {
    render(<SigninForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email on submit", async () => {
    const user = userEvent.setup();
    render(<SigninForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(signin).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<SigninForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "not-an-email");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(signin).not.toHaveBeenCalled();
  });

  it("shows validation error for empty password on submit", async () => {
    const user = userEvent.setup();
    render(<SigninForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(signin).not.toHaveBeenCalled();
  });

  it("displays server error message for invalid credentials", async () => {
    const user = userEvent.setup();
    vi.mocked(signin).mockResolvedValue({
      error: "Invalid login credentials",
    });
    render(<SigninForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/invalid login credentials/i)
    ).toBeInTheDocument();
    // Form should remain usable - email and password fields still present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    const user = userEvent.setup();
    vi.mocked(signin).mockResolvedValue({ error: null });
    render(<SigninForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    expect(signin).toHaveBeenCalled();
    const callArg = vi.mocked(signin).mock.calls[0][0];
    expect(callArg).toBeInstanceOf(FormData);
  });
});
