import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { apiRequest } from "@/lib/api/client";
import { resourceEnvelope } from "@/lib/api/envelopes";
import {
  ApiContractError,
  ApiError,
  ApiUnavailableError,
} from "@/lib/api/failure";

const categoriesSchema = resourceEnvelope(
  z.array(z.object({ id: z.string(), name: z.string() })),
);

describe("apiRequest", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.API_URL;
  });

  it("lê o envelope data de uma coleção pública", async () => {
    process.env.API_URL = "http://127.0.0.1:8000";
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(
          JSON.stringify({
            data: [{ id: "cat-1", name: "Papelaria", extra: true }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await apiRequest("/api/v1/categories", {
      schema: categoriesSchema,
    });

    expect(result.data).toEqual([{ id: "cat-1", name: "Papelaria" }]);
    expect(fetchMock).toHaveBeenCalledOnce();
    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("fetch não foi chamado");
    const init = call[1];
    expect(String(call[0])).toBe("http://127.0.0.1:8000/api/v1/categories");
    expect(init?.cache).toBe("no-store");
    expect(new Headers(init?.headers).has("Authorization")).toBe(false);
  });

  it("devolve o erro de campo sem incluir o corpo cru na mensagem", async () => {
    process.env.API_URL = "http://127.0.0.1:8000";
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              message: "Os dados enviados são inválidos.",
              errors: { email: ["O campo e-mail é obrigatório."] },
            }),
            {
              status: 422,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": "30",
              },
            },
          ),
      ),
    );

    await expect(
      apiRequest("/api/v1/auth/register", {
        method: "POST",
        body: { email: "" },
        schema: z.object({}),
      }),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 422,
      retryAfter: 30,
      errors: { email: ["O campo e-mail é obrigatório."] },
    } satisfies Partial<ApiError>);
  });

  it("rejeita sucesso fora do schema", async () => {
    process.env.API_URL = "http://127.0.0.1:8000";
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ data: "nope" }), { status: 200 }),
      ),
    );

    await expect(
      apiRequest("/api/v1/categories", { schema: categoriesSchema }),
    ).rejects.toBeInstanceOf(ApiContractError);
  });

  it("trata falha de rede como indisponibilidade", async () => {
    process.env.API_URL = "http://127.0.0.1:8000";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("connect ECONNREFUSED");
      }),
    );

    await expect(apiRequest("/api/v1/categories")).rejects.toBeInstanceOf(
      ApiUnavailableError,
    );
  });

  it("aceita 204 sem corpo", async () => {
    process.env.API_URL = "http://127.0.0.1:8000";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 204 })),
    );

    await expect(
      apiRequest("/api/v1/auth/logout", { method: "POST", token: "segredo" }),
    ).resolves.toBeUndefined();
  });
});
