import Link from "next/link";
import { ShoppingCart, User } from "@phosphor-icons/react/ssr";

import { ResendVerificationForm } from "@/components/account/resend-verification-form";
import { logout } from "@/lib/auth/logout";
import { readSessionUser } from "@/lib/auth/current-user";

function CartLink() {
  return (
    <Link
      href="/carrinho"
      className="inline-flex items-center gap-1.5 font-semibold"
    >
      <ShoppingCart size={18} weight="regular" aria-hidden="true" />
      <span className="max-md:sr-only">Carrinho</span>
    </Link>
  );
}

export function GuestAccount() {
  return (
    <div className="order-2 ml-auto flex items-center gap-4 md:order-3 md:ml-0">
      <Link
        href="/entrar"
        className="inline-flex items-center gap-1.5 font-semibold"
      >
        <User size={18} weight="regular" aria-hidden="true" />
        Entrar
      </Link>
      <CartLink />
    </div>
  );
}

export async function HeaderAccount() {
  const user = await readSessionUser();
  if (!user) return <GuestAccount />;

  return (
    <>
      <div className="order-2 ml-auto flex items-center gap-4 md:order-3 md:ml-0">
        <span className="max-w-40 truncate font-semibold">{user.name}</span>
        <form action={logout}>
          <button type="submit" className="font-semibold">
            Sair
          </button>
        </form>
        <CartLink />
      </div>
      {user.emailVerified ? null : (
        <div className="order-4 flex basis-full flex-wrap items-center gap-2 text-sm">
          <span>Confirme seu e-mail para comprar.</span>
          <ResendVerificationForm />
        </div>
      )}
    </>
  );
}
