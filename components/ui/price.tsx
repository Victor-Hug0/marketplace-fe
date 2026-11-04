import { formatCents } from "@/lib/money/format";

export type OfferPrice = {
  price_cents: number;
  promotional_price_cents?: number | null;
  current_price_cents: number;
};

const sizeClass = {
  card: "text-[18px] leading-6",
  buybox: "text-[28px] leading-8",
} as const;

export function offerIsOnSale(offer: OfferPrice): boolean {
  return (
    typeof offer.promotional_price_cents === "number" &&
    offer.promotional_price_cents < offer.price_cents &&
    offer.current_price_cents === offer.promotional_price_cents
  );
}

export function Price({
  offer,
  size,
}: {
  offer: OfferPrice;
  size: keyof typeof sizeClass;
}) {
  const onSale = offerIsOnSale(offer);

  return (
    <p className="flex flex-wrap items-baseline gap-2 text-ink">
      {onSale ? (
        <s className="text-[14px] leading-5 font-normal text-ink-soft">
          {formatCents(offer.price_cents)}
        </s>
      ) : null}
      <span className={`font-semibold ${sizeClass[size]}`}>
        {formatCents(offer.current_price_cents)}
      </span>
    </p>
  );
}
