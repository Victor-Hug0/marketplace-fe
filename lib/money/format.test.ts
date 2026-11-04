import { describe, expect, it } from "vitest";

import {
  formatCents,
  parseBrlToApiAmount,
  priceView,
} from "@/lib/money/format";

describe("dinheiro", () => {
  it("formata 179990 centavos como R$ 1.799,90 sem divisão decimal", () => {
    expect(formatCents(179990)).toBe("R$ 1.799,90");
  });

  it("formata zero e valores abaixo de um real", () => {
    expect(formatCents(0)).toBe("R$ 0,00");
    expect(formatCents(10)).toBe("R$ 0,10");
    expect(formatCents(100)).toBe("R$ 1,00");
  });

  it("marca promoção quando o preço anterior é maior", () => {
    expect(priceView(179990, 199990)).toEqual({
      currentLabel: "R$ 1.799,90",
      previousLabel: "R$ 1.999,90",
      onSale: true,
    });
  });

  it("não risca o preço quando não há promoção", () => {
    expect(priceView(1000, 1000).onSale).toBe(false);
    expect(priceView(1000).previousLabel).toBeNull();
  });

  it("converte entrada pt-BR para o valor da oferta", () => {
    expect(parseBrlToApiAmount("1.799,90")).toBe("1799.90");
    expect(parseBrlToApiAmount("R$ 0,00")).toBe("0.00");
  });

  it("recusa formato americano e casa decimal faltando", () => {
    expect(() => parseBrlToApiAmount("1,799.90")).toThrow();
    expect(() => parseBrlToApiAmount("10,5")).toThrow();
  });
});
