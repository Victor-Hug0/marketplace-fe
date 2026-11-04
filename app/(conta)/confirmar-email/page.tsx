import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { ResendVerificationForm } from "@/components/account/resend-verification-form";
import { InlineAlert } from "@/components/ui/inline-alert";
import { confirmEmailLink } from "@/lib/auth/actions";
import { firstQuery } from "@/lib/auth/account";
import { hasSessionCookie } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
};

export default function ConfirmarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string | string[];
    hash?: string | string[];
    expires?: string | string[];
    signature?: string | string[];
  }>;
}) {
  return (
    <Suspense
      fallback={
        <h1 className="text-[20px] leading-6 font-semibold">
          Confirmar e-mail
        </h1>
      }
    >
      <ConfirmContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ConfirmContent({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string | string[];
    hash?: string | string[];
    expires?: string | string[];
    signature?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const result = await confirmEmailLink({
    id: firstQuery(params.id),
    hash: firstQuery(params.hash),
    expires: firstQuery(params.expires),
    signature: firstQuery(params.signature),
  });
  const signedIn = await hasSessionCookie();

  return (
    <section className="grid gap-4">
      <h1 className="text-[20px] leading-6 font-semibold">Confirmar e-mail</h1>
      <InlineAlert tone={result.ok ? "info" : "error"}>
        {result.message}
      </InlineAlert>
      {result.ok ? (
        <Link href="/entrar" className="font-semibold text-action">
          Entrar
        </Link>
      ) : signedIn ? (
        <ResendVerificationForm />
      ) : (
        <p>
          Entre na sua conta para pedir outro link.{" "}
          <Link href="/entrar" className="font-semibold text-action">
            Entrar
          </Link>
        </p>
      )}
    </section>
  );
}
