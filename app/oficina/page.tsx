import type { Metadata } from "next";

import { AddressForm } from "@/components/account/address-form";
import { OrdersTable } from "@/components/admin/orders-table";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductDetail } from "@/components/catalog/product-detail";
import { CartReview } from "@/components/commerce/cart-review";
import { Badge, OrderStatusBadge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import {
  workshopCards,
  workshopCart,
  workshopCartTotalCents,
  workshopOrders,
  workshopProduct,
} from "@/app/oficina/fixtures";

export const metadata: Metadata = {
  title: "Oficina visual",
  robots: { index: false, follow: false },
};

export default function OficinaPage() {
  const priced = workshopCards[0]?.offer;

  return (
    <div className="bg-canvas text-ink">
      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 py-6">
        <header>
          <h1 className="text-[20px] leading-6 font-semibold">
            Oficina visual
          </h1>
          <p className="mt-2 text-ink-soft">
            Peças com dados fixos, no formato da API. Esta página não entra no
            cabeçalho da loja.
          </p>
        </header>

        <section className="grid gap-3">
          <h2 className="font-semibold">Preço</h2>
          {priced ? (
            <div className="grid gap-3 border border-line bg-surface p-4">
              <Price offer={priced} size="card" />
              <Price offer={priced} size="buybox" />
            </div>
          ) : null}
        </section>

        <section className="grid gap-3">
          <h2 className="font-semibold">Selos</h2>
          <div className="flex flex-wrap gap-2 border border-line bg-surface p-4">
            <Badge tone="promo">Promoção</Badge>
            <OrderStatusBadge status="pending_payment" />
            <OrderStatusBadge status="delivered" />
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="font-semibold">Cards</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {workshopCards.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="font-semibold">Detalhe e Buy Box</h2>
          <ProductDetail product={workshopProduct} />
        </section>

        <section className="grid gap-3">
          <h2 className="font-semibold">Carrinho</h2>
          <CartReview
            stores={workshopCart}
            total_cents={workshopCartTotalCents}
          />
        </section>

        <section className="grid gap-3">
          <h2 className="font-semibold">Endereço</h2>
          <AddressForm />
        </section>

        <section className="grid gap-3">
          <h2 className="font-semibold">Pedidos</h2>
          <OrdersTable orders={workshopOrders} />
        </section>
      </main>
    </div>
  );
}
