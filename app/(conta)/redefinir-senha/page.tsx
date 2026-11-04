import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/account/reset-password-form";
import { firstQuery } from "@/lib/auth/account";

export const metadata: Metadata = {
  title: "Redefinir senha",
};

export default function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string | string[];
    email?: string | string[];
  }>;
}) {
  return (
    <Suspense
      fallback={
        <h1 className="text-[20px] leading-6 font-semibold">Redefinir senha</h1>
      }
    >
      <ResetContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetContent({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string | string[];
    email?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const token = firstQuery(params.token);
  const email = firstQuery(params.email);

  return (
    <section className="grid gap-4">
      <h1 className="text-[20px] leading-6 font-semibold">Redefinir senha</h1>
      {token === "" || email === "" ? (
        <p>
          Este link está incompleto.{" "}
          <Link href="/recuperar-senha" className="font-semibold text-action">
            Peça um novo
          </Link>
          .
        </p>
      ) : (
        <ResetPasswordForm token={token} email={email} />
      )}
    </section>
  );
}
