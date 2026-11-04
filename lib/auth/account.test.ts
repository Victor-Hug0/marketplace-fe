import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/failure";
import {
  FORGOT_PASSWORD_MESSAGE,
  formStateFromError,
  googleNoticeCopy,
  passwordError,
  registerFieldErrors,
} from "@/lib/auth/account";
import { oauthStateMatches } from "@/lib/auth/oauth-state";

describe("conta", () => {
  it("responde o esqueci senha sem dizer se o e-mail existe", () => {
    expect(FORGOT_PASSWORD_MESSAGE).toBe(
      "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.",
    );
    expect(FORGOT_PASSWORD_MESSAGE.toLowerCase()).not.toContain("não encontr");
    expect(FORGOT_PASSWORD_MESSAGE.toLowerCase()).not.toContain("não existe");
  });

  it("rejeita senha fora da regra e cpf curto", () => {
    expect(passwordError("fraca")).toBeTruthy();
    expect(passwordError("Senha@Forte123")).toBeNull();

    const errors = registerFieldErrors({
      name: "Maria Souza",
      email: "maria@example.com",
      cpf: "123",
      phone: "11987654321",
      password: "Senha@Forte123",
      confirmation: "Senha@Forte123",
    });

    expect(errors.cpf).toBe("O CPF precisa ter 11 dígitos.");
    expect(errors.email).toBeUndefined();
  });

  it("mostra o erro de campo do 422 e não revela outro e-mail", () => {
    const state = formStateFromError(
      new ApiError({
        status: 422,
        message: "Os dados enviados são inválidos.",
        errors: { email: ["O email já está em uso"] },
        retryAfter: null,
      }),
    );

    expect(state.fieldErrors.email).toBe("O email já está em uso");
    expect(state.formError).toBeNull();
  });

  it("não aceita state do Google ausente ou trocado", () => {
    expect(oauthStateMatches(undefined, "abc")).toBe(false);
    expect(oauthStateMatches("abc", "abd")).toBe(false);
    expect(oauthStateMatches("abc", "abc")).toBe(true);
  });

  it("ignora motivo de Google desconhecido", () => {
    expect(googleNoticeCopy("state")).toContain("Tente de novo");
    expect(googleNoticeCopy("javascript:alert(1)")).toBeNull();
  });
});
