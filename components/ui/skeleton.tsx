export function Skeleton({ label = "Carregando" }: { label?: string }) {
  return <div aria-busy="true" aria-label={label} data-skeleton="" />;
}
