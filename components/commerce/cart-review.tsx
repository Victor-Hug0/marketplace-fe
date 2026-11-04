import { Price, type OfferPrice } from "@/components/ui/price";
import { formatCents } from "@/lib/money/format";

export type CartLine = {
  name: string;
  quantity: number;
  offer: OfferPrice;
  line_total_cents: number;
};

export type CartStore = {
  store_name: string;
  is_platform: boolean;
  lines: CartLine[];
  subtotal_cents: number;
};

export function CartReview({
  stores,
  total_cents,
}: {
  stores: CartStore[];
  total_cents: number;
}) {
  return (
    <div className="grid gap-4">
      <p className="text-ink-soft">
        O preço é o vigente. O frete é calculado no carrinho, por loja.
      </p>
      {stores.map((store) => (
        <section
          key={store.store_name}
          className="border border-line bg-surface"
        >
          <h3 className="border-b border-line px-4 py-3 font-semibold">
            {store.is_platform ? "Vendido pelo E-mall" : store.store_name}
          </h3>
          <ul>
            {store.lines.map((line) => (
              <li
                key={line.name}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3 sm:grid-cols-[64px_minmax(0,1fr)_auto]"
              >
                <div
                  role="img"
                  aria-label={line.name}
                  className="grid size-16 place-items-center border border-line bg-canvas text-ink-soft"
                >
                  <span aria-hidden="true">Foto</span>
                </div>
                <div>
                  <p className="font-semibold">{line.name}</p>
                  <Price offer={line.offer} size="card" />
                  <p className="text-ink-soft">Quantidade {line.quantity}</p>
                </div>
                <p className="col-start-2 font-semibold sm:col-start-auto sm:text-right">
                  {formatCents(line.line_total_cents)}
                </p>
              </li>
            ))}
          </ul>
          <p className="flex justify-between px-4 py-3">
            <span>Subtotal da loja</span>
            <span className="font-semibold">
              {formatCents(store.subtotal_cents)}
            </span>
          </p>
        </section>
      ))}
      <p className="flex justify-between border border-line bg-surface px-4 py-3 text-[18px] leading-6">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">{formatCents(total_cents)}</span>
      </p>
    </div>
  );
}
