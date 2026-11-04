export function formatPromoPeriod(startsAt: string, endsAt: string): string {
  const format = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

  return `${format.format(new Date(startsAt))} a ${format.format(new Date(endsAt))}`;
}
