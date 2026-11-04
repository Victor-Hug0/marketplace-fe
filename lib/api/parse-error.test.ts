import { describe, expect, it } from "vitest";

import { ApiContractError, failureCopy } from "@/lib/api/failure";
import { parseApiErrorBody } from "@/lib/api/parse-error";

describe("parseApiErrorBody", () => {
  it("preserva erros de campo do 422 e o Retry-After", () => {
    const failure = parseApiErrorBody(
      422,
      {
        message: "Os dados enviados são inválidos.",
        timestamp: "2026-10-20T10:00:00-03:00",
        errors: { email: ["O campo e-mail é obrigatório."] },
      },
      "60",
    );

    expect(failure).toEqual({
      status: 422,
      message: "Os dados enviados são inválidos.",
      errors: { email: ["O campo e-mail é obrigatório."] },
      retryAfter: 60,
    });
    expect(failureCopy(failure).title).toBe("Os dados enviados são inválidos.");
  });

  it("trata errors em lista como ausência de campo", () => {
    const failure = parseApiErrorBody(
      401,
      {
        message: "Credenciais inválidas",
        timestamp: "2026-10-20T10:00:00-03:00",
        errors: [],
      },
      null,
    );

    expect(failure.errors).toEqual({});
    expect(failure.retryAfter).toBeNull();
    expect(failureCopy(failure)).toEqual({
      title: "Acesso não autorizado.",
      detail: "Credenciais inválidas",
    });
  });

  it("rejeita um corpo que não é o envelope de erro", () => {
    expect(() => parseApiErrorBody(500, { oops: true }, null)).toThrow(
      ApiContractError,
    );
  });

  it("não repassa detalhe interno de erro 500", () => {
    const failure = parseApiErrorBody(
      500,
      { message: "SQLSTATE[08006] connection refused", errors: [] },
      null,
    );

    expect(failureCopy(failure).detail).toBe(
      "O servidor não concluiu a solicitação.",
    );
  });

  it("explica o 429 com os segundos enviados pela API", () => {
    const failure = parseApiErrorBody(
      429,
      { message: "Muitas tentativas.", errors: [] },
      "12",
    );

    expect(failureCopy(failure)).toEqual({
      title: "Muitas tentativas.",
      detail: "Espere 12 segundos antes de tentar de novo.",
    });
  });
});
