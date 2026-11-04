import { MagnifyingGlass } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-header text-header-ink">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-4">
        <Link href="/" className="text-[20px] leading-6 font-semibold">
          E-mall
        </Link>
        <form
          role="search"
          action="/oficina"
          className="flex min-w-0 flex-1 gap-2"
        >
          <label htmlFor="busca" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="busca"
            name="q"
            type="search"
            placeholder="Buscar no E-mall"
            className="min-h-9 min-w-0 flex-1 rounded-sm border border-line bg-surface px-3 text-ink placeholder:text-ink-soft"
          />
          <Button type="submit" className="gap-2">
            <MagnifyingGlass size={16} weight="regular" aria-hidden="true" />
            Buscar
          </Button>
        </form>
        <Link href="/entrar" className="font-semibold">
          Entrar
        </Link>
      </div>
    </header>
  );
}
