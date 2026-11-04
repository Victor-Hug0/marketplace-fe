/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  ProductCard,
  type ProductCardData,
} from "@/components/catalog/product-card";
import { Price } from "@/components/ui/price";

import "@testing-library/jest-dom/vitest";

const promo: ProductCardData = {
  name: "Fone sem fio",
  image_label: "Fone sem fio",
  has_offer: true,
  offer: {
    price_cents: 199990,
    promotional_price_cents: 179990,
    current_price_cents: 179990,
  },
  promo_starts_at: "2026-11-01T00:00:00-03:00",
  promo_ends_at: "2026-11-30T23:59:00-03:00",
  rating_average: 4.6,
  rating_count: 128,
  store_name: "E-mall",
  is_platform: true,
  available_stock: 8,
};

afterEach(() => {
  cleanup();
});

describe("preço e card", () => {
  it("destaca o preço pago e risca o anterior na promoção", () => {
    render(<Price offer={promo.offer!} size="card" />);

    expect(screen.getByText("R$ 1.799,90").tagName).toBe("SPAN");
    expect(screen.getByText("R$ 1.999,90").tagName).toBe("S");
  });

  it("mostra a loja da plataforma e a promoção uma vez", () => {
    render(<ProductCard product={promo} />);

    expect(screen.getByText("Vendido pelo E-mall")).toBeInTheDocument();
    expect(screen.getAllByText("Promoção")).toHaveLength(1);
    expect(screen.getByText("R$ 1.799,90")).toBeInTheDocument();
  });

  it("explica a ausência de oferta sem inventar preço", () => {
    render(
      <ProductCard
        product={{
          ...promo,
          name: "Mochila urbana",
          has_offer: false,
          offer: null,
          is_platform: false,
        }}
      />,
    );

    expect(screen.getByText("Sem ofertas compráveis")).toBeInTheDocument();
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
  });
});
