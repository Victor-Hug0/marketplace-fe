import { Suspense } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import {
  GuestAccount,
  HeaderAccount,
} from "@/components/catalog/header-account";

export function SiteHeader() {
  return (
    <header className="bg-header text-header-ink">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="order-1 text-[20px] leading-6 font-semibold">
          E-mall
        </Link>
        <Suspense fallback={<GuestAccount />}>
          <HeaderAccount />
        </Suspense>
        <form
          role="search"
          action="/busca"
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
              <MagnifyingGlass size={18} weight="regular" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
