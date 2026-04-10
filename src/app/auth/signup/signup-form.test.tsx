import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./signup-form";

// Mock the signup action
vi.mock("../actions", () => ({
  signup: vi.fn(),
}));

import { signup } from "../actions";

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields with submit button", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email on submit", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Only fill password, leave email empty
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "not-an-email");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it("shows validation error for empty password on submit", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Only fill email, leave password empty
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it("shows validation error for password shorter than 6 characters", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    const user = userEvent.setup();
    vi.mocked(signup).mockResolvedValue({ error: null });
    render(<SignupForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(signup).toHaveBeenCalled();
    const callArg = vi.mocked(signup).mock.calls[0][0];
    expect(callArg).toBeInstanceOf(FormData);
  });

  it("displays server error message when signup fails", async () => {
    const user = userEvent.setup();
    vi.mocked(signup).mockResolvedValue({
      error: "A user with this email already exists.",
    });
    render(<SignupForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "existing@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/user with this email already exists/i)
    ).toBeInTheDocument();
  });
});
