/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/account/login-form";

import "@testing-library/jest-dom/vitest";

vi.mock("@/lib/auth/actions", () => ({
  loginAction: vi.fn(async () => ({
    formError: null,
    fieldErrors: { email: "Informe um e-mail válido." },
    done: null,
  })),
}));

afterEach(() => {
  cleanup();
});

describe("login", () => {
  it("liga o erro ao campo de e-mail", async () => {
    render(<LoginForm next="/" />);

    screen.getByRole("button", { name: "Entrar" }).click();

    const message = await screen.findByText("Informe um e-mail válido.");
    const email = screen.getByLabelText("E-mail");

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", message.id);
  });
});
