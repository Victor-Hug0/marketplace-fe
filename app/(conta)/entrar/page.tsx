import { Suspense } from "react";

import { InlineAlert } from "@/components/ui/inline-alert";

export default function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  return (
    <main>
      <h1>Entrar</h1>
      <Suspense fallback={null}>
        <SessionNotice searchParams={searchParams} />
      </Suspense>
      <p>O formulário de acesso entra na etapa de conta.</p>
    </main>
  );
}

async function SessionNotice({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const params = await searchParams;
  if (params.aviso !== "sessao") return null;

  return <InlineAlert tone="warning">Sua sessão terminou.</InlineAlert>;
}
