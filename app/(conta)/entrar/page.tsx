import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { GoogleButton } from "@/components/account/google-button";
import { LoginForm } from "@/components/account/login-form";
import { InlineAlert } from "@/components/ui/inline-alert";
import { firstQuery, googleNoticeCopy } from "@/lib/auth/account";
import { safeNextPath } from "@/lib/auth/next-path";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{
    aviso?: string | string[];
    next?: string | string[];
    motivo?: string | string[];
  }>;
}) {
  return (
    <Suspense
      fallback={<h1 className="text-[20px] leading-6 font-semibold">Entrar</h1>}
    >
      <EntrarContent searchParams={searchParams} />
    </Suspense>
  );
}

async function EntrarContent({
  searchParams,
}: {
  searchParams: Promise<{
    aviso?: string | string[];
    next?: string | string[];
    motivo?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const aviso = firstQuery(params.aviso);
  const next = safeNextPath(firstQuery(params.next));
  const googleNotice =
    aviso === "google" ? googleNoticeCopy(firstQuery(params.motivo)) : null;

  return (
    <section className="grid gap-4">
      <h1 className="text-[20px] leading-6 font-semibold">Entrar</h1>
      {aviso === "sessao" ? (
        <InlineAlert tone="warning">Sua sessão terminou.</InlineAlert>
      ) : null}
      {aviso === "senha" ? (
        <InlineAlert tone="info">
          Senha redefinida. Entre com a nova senha.
        </InlineAlert>
      ) : null}
      {googleNotice ? (
        <InlineAlert tone="error">{googleNotice}</InlineAlert>
      ) : null}
      <LoginForm next={next} />
      <GoogleButton />
      <p className="text-ink-soft">
        <Link href="/recuperar-senha" className="font-semibold text-action">
          Esqueci a senha
        </Link>
      </p>
      <p>
        Não tem conta?{" "}
        <Link href="/cadastrar" className="font-semibold text-action">
          Cadastre-se
        </Link>
      </p>
    </section>
  );
}
