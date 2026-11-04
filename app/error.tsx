"use client";

export default function RootError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <main>
      <h1>Algo deu errado</h1>
      <p>Não foi possível mostrar esta página.</p>
      <button type="button" onClick={() => retry()}>
        Tentar de novo
      </button>
    </main>
  );
}
