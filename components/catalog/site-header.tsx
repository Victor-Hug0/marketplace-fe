import { MagnifyingGlass, ShoppingCart, User } from "@phosphor-icons/react/ssr";
import Link from "next/link";

const categories = ["Eletrônicos", "Casa"] as const;

export function SiteHeader() {
  return (
    <header className="bg-header text-header-ink">
      <div className="mx-auto grid w-full max-w-[1200px] gap-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="order-1 text-[20px] leading-6 font-semibold"
          >
            E-mall
          </Link>
          <div className="order-2 ml-auto flex items-center gap-4 md:order-3 md:ml-0">
            <Link
              href="/entrar"
              className="inline-flex items-center gap-1.5 font-semibold"
            >
              <User size={18} weight="regular" aria-hidden="true" />
              Entrar
            </Link>
            <Link
              href="/carrinho"
              className="inline-flex items-center gap-1.5 font-semibold"
            >
              <ShoppingCart size={18} weight="regular" aria-hidden="true" />
              <span className="max-md:sr-only">Carrinho</span>
            </Link>
          </div>
          <form
            role="search"
            action="/oficina"
            className="order-3 w-full md:order-2 md:min-w-0 md:flex-1"
          >
            <label htmlFor="busca" className="sr-only">
              Buscar produtos
            </label>
            <div className="flex min-h-9 items-center rounded-sm bg-surface pr-1">
              <input
                id="busca"
                name="q"
                type="search"
                placeholder="Buscar no E-mall"
                className="min-h-9 min-w-0 flex-1 bg-transparent px-3 text-ink outline-none placeholder:text-ink-soft"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="grid size-8 place-items-center text-ink"
              >
                <MagnifyingGlass
                  size={18}
                  weight="regular"
                  aria-hidden="true"
                />
              </button>
            </div>
          </form>
        </div>
        <nav aria-label="Categorias" className="flex flex-wrap gap-x-4 gap-y-1">
          {categories.map((name) => (
            <Link key={name} href="/oficina" className="leading-5">
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
