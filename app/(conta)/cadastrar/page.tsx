import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/account/register-form";

export const metadata: Metadata = {
  title: "Cadastrar",
};

export default function CadastrarPage() {
  return (
    <section className="grid gap-4">
      <h1 className="text-[20px] leading-6 font-semibold">Criar conta</h1>
      <p className="text-ink-soft">
        A senha precisa ter de 8 a 64 caracteres, com maiúscula, minúscula,
        número e símbolo. O CPF tem 11 dígitos.
      </p>
      <RegisterForm />
      <p>
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-action">
          Entrar
        </Link>
      </p>
    </section>
  );
}
