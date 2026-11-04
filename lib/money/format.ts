export function formatCents(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new Error(
      "O valor em centavos precisa ser um inteiro maior ou igual a zero.",
    );
  }

  const digits = String(cents);
  const fraction = digits.slice(-2).padStart(2, "0");
  const wholeDigits = digits.length > 2 ? digits.slice(0, -2) : "0";
  const grouped = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(Number(wholeDigits));

  return `R$ ${grouped},${fraction}`;
}

export type PriceView = {
  currentLabel: string;
  previousLabel: string | null;
  onSale: boolean;
};

export function priceView(
  currentCents: number,
  previousCents?: number | null,
): PriceView {
  const onSale =
    typeof previousCents === "number" && previousCents > currentCents;

  return {
    currentLabel: formatCents(currentCents),
    previousLabel: onSale ? formatCents(previousCents) : null,
    onSale,
  };
}

export function parseBrlToApiAmount(input: string): string {
  const cleaned = input.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  const match = /^(\d{1,3}(?:\.\d{3})+|\d+),(\d{2})$/.exec(cleaned);
  if (!match?.[1] || !match[2]) {
    throw new Error("Informe o preço com duas casas, como 1.799,90.");
  }

  const whole = match[1].replaceAll(".", "");
  if (whole.length > 1 && whole.startsWith("0")) {
    throw new Error("Informe o preço com duas casas, como 1.799,90.");
  }

  return `${whole}.${match[2]}`;
}
