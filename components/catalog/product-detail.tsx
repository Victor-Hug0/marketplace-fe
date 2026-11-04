import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price, offerIsOnSale, type OfferPrice } from "@/components/ui/price";
import { formatPromoPeriod } from "@/lib/catalog/promo-period";
import { formatCents } from "@/lib/money/format";

export type BuyBoxOffer = {
  store_name: string;
  is_platform: boolean;
  offer: OfferPrice;
  available_stock: number;
  promo_starts_at?: string | null;
  promo_ends_at?: string | null;
};

export type ProductDetailData = {
  name: string;
  images: string[];
  attributes: { name: string; value: string }[];
  winner: BuyBoxOffer;
  other_offers: BuyBoxOffer[];
};

function stockLabel(stock: number): string {
  if (stock === 1) return "Última unidade";
  if (stock > 1) return "Em estoque";
  return "Sem estoque";
}

function SellerLine({ offer }: { offer: BuyBoxOffer }) {
  return <p>{offer.is_platform ? "Vendido pelo E-mall" : offer.store_name}</p>;
}

export function ProductDetail({ product }: { product: ProductDetailData }) {
  return (
    <div className="relative max-md:max-h-[720px] max-md:overflow-y-auto max-md:border max-md:border-line max-md:bg-surface">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_280px]">
        <div className="grid grid-cols-3 gap-2">
          {product.images.map((label, index) => (
            <div
              key={label}
              role="img"
              aria-label={label}
              className={`grid aspect-square place-items-center border border-line bg-canvas text-ink-soft ${index === 0 ? "col-span-3" : ""}`}
            >
              <span aria-hidden="true">Foto</span>
            </div>
          ))}
        </div>
        <div className="max-lg:order-last">
          <h3 className="text-[20px] leading-6 font-semibold">
            {product.name}
          </h3>
          <dl className="mt-4 grid gap-2">
            {product.attributes.map((attribute) => (
              <div
                key={attribute.name}
                className="grid grid-cols-[120px_1fr] gap-2"
              >
                <dt className="text-ink-soft">{attribute.name}</dt>
                <dd>{attribute.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className="flex flex-col gap-3 border border-line bg-surface p-4 md:row-span-2 lg:row-span-1">
          <Price offer={product.winner.offer} size="buybox" />
          {offerIsOnSale(product.winner.offer) &&
          product.winner.promo_starts_at &&
          product.winner.promo_ends_at ? (
            <p className="flex flex-wrap items-center gap-2">
              <Badge tone="promo">Promoção</Badge>
              <span className="text-ink-soft">
                {formatPromoPeriod(
                  product.winner.promo_starts_at,
                  product.winner.promo_ends_at,
                )}
              </span>
            </p>
          ) : null}
          <p
            className={
              product.winner.available_stock === 1 ? "text-warning" : ""
            }
          >
            {stockLabel(product.winner.available_stock)}
          </p>
          <SellerLine offer={product.winner} />
          <div className="hidden md:block">
            <Button className="w-full">Comprar</Button>
          </div>
          {product.other_offers.length > 0 ? (
            <div className="border-t border-line pt-3">
              <h4 className="font-semibold">Outras ofertas</h4>
              <ul className="mt-2 grid gap-2">
                {product.other_offers.map((offer) => (
                  <li key={offer.store_name}>
                    <SellerLine offer={offer} />
                    <p>{formatCents(offer.offer.current_price_cents)}</p>
                    <p className="text-ink-soft">
                      {stockLabel(offer.available_stock)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
      <div className="sticky bottom-0 border-t border-line bg-surface p-3 md:hidden">
        <Button className="w-full">Comprar</Button>
      </div>
    </div>
  );
}
