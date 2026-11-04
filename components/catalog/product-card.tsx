import { Badge } from "@/components/ui/badge";
import { Price, type OfferPrice, offerIsOnSale } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { formatPromoPeriod } from "@/lib/catalog/promo-period";

export type ProductCardData = {
  name: string;
  image_label: string;
  has_offer: boolean;
  offer: OfferPrice | null;
  promo_starts_at?: string | null;
  promo_ends_at?: string | null;
  rating_average: number | null;
  rating_count: number;
  store_name: string;
  is_platform: boolean;
  available_stock: number | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const onSale = product.offer ? offerIsOnSale(product.offer) : false;

  return (
    <article className="flex h-full flex-col gap-2 rounded-sm border border-line bg-surface p-3">
      <div
        role="img"
        aria-label={product.image_label}
        className="grid aspect-square place-items-center border border-line bg-canvas text-ink-soft"
      >
        <span aria-hidden="true">Foto</span>
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      {product.has_offer && product.offer ? (
        <>
          <Price offer={product.offer} size="card" />
          {onSale && product.promo_starts_at && product.promo_ends_at ? (
            <p className="flex flex-wrap items-center gap-2">
              <Badge tone="promo">Promoção</Badge>
              <span className="text-ink-soft">
                {formatPromoPeriod(
                  product.promo_starts_at,
                  product.promo_ends_at,
                )}
              </span>
            </p>
          ) : null}
          {product.available_stock === 1 ? (
            <p className="text-warning">Última unidade</p>
          ) : null}
          <Rating
            average={product.rating_average}
            count={product.rating_count}
          />
          <p>
            {product.is_platform ? "Vendido pelo E-mall" : product.store_name}
          </p>
        </>
      ) : (
        <p>Sem ofertas compráveis</p>
      )}
    </article>
  );
}
