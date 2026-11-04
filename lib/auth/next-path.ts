const LOCAL_ORIGIN = "http://emall.local";

export function safeNextPath(value: string | null | undefined): string {
  if (value == null) return "/";

  const trimmed = value.trim();
  if (trimmed === "") return "/";
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//")) return "/";
  if (trimmed.includes("\\")) return "/";
  if (trimmed.includes("://")) return "/";
  if (
    trimmed.includes("\n") ||
    trimmed.includes("\r") ||
    trimmed.includes("\t")
  ) {
    return "/";
  }

  let url: URL;
  try {
    url = new URL(trimmed, LOCAL_ORIGIN);
  } catch {
    return "/";
  }

  if (url.origin !== LOCAL_ORIGIN) return "/";
  if (url.pathname.startsWith("/api/")) return "/";

  return `${url.pathname}${url.search}`;
}

export function loginPath(nextPath: string, sessionEnded: boolean): string {
  const params = new URLSearchParams();
  if (sessionEnded) params.set("aviso", "sessao");
  params.set("next", safeNextPath(nextPath));
  return `/entrar?${params.toString()}`;
}

export function renewPath(nextPath: string): string {
  const params = new URLSearchParams();
  params.set("next", safeNextPath(nextPath));
  return `/api/sessao/renovar?${params.toString()}`;
}
