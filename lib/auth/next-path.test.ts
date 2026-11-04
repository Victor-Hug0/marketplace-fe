import { describe, expect, it } from "vitest";

import { loginPath, safeNextPath } from "@/lib/auth/next-path";

describe("safeNextPath", () => {
  it("mantém caminho interno", () => {
    expect(safeNextPath("/pedidos/10?aba=pagamento")).toBe(
      "/pedidos/10?aba=pagamento",
    );
    expect(safeNextPath(null)).toBe("/");
  });

  it("recusa URL absoluta e protocolo relativo", () => {
    expect(safeNextPath("https://evil.example/roubo")).toBe("/");
    expect(safeNextPath("//evil.example/roubo")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("http://127.0.0.1:3000/admin")).toBe("/");
  });

  it("não usa a rota interna de sessão como destino", () => {
    expect(safeNextPath("/api/sessao/renovar?next=/admin")).toBe("/");
  });

  it("monta o login sem aviso quando a pessoa só ainda não entrou", () => {
    expect(loginPath("/carrinho", false)).toBe("/entrar?next=%2Fcarrinho");
    expect(loginPath("https://evil.example", true)).toBe(
      "/entrar?aviso=sessao&next=%2F",
    );
  });
});
