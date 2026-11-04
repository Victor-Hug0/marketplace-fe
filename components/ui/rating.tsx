import { Star } from "@phosphor-icons/react/ssr";

export function Rating({
  average,
  count,
}: {
  average: number | null;
  count: number;
}) {
  if (average === null || count === 0) {
    return <p className="text-ink-soft">Sem avaliações</p>;
  }

  const label = average.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <p className="text-ink">
      <Star
        size={16}
        weight="regular"
        className="mr-1 inline text-star"
        aria-hidden="true"
      />
      <span className="sr-only">Nota </span>
      {label}
      <span className="text-ink-soft"> · {count} avaliações</span>
    </p>
  );
}
