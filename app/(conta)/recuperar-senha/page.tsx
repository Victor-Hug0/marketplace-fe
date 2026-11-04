import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/account/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
};

export default function RecuperarSenhaPage() {
  return (
    <section className="grid gap-4">
      <h1 className="text-[20px] leading-6 font-semibold">Recuperar senha</h1>
      <p className="text-ink-soft">
        Se o e-mail estiver cadastrado, você recebe um link para escolher outra
        senha.
      </p>
      <ForgotPasswordForm />
      <p>
        <Link href="/entrar" className="font-semibold text-action">
          Voltar ao login
        </Link>
      </p>
    </section>
  );
}
