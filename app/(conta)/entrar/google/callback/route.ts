import { NextResponse, type NextRequest } from "next/server";

import { completeGoogleCallback } from "@/lib/auth/actions";
import { firstQuery } from "@/lib/auth/account";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = await completeGoogleCallback({
    code: firstQuery(params.get("code") ?? undefined),
    state: firstQuery(params.get("state") ?? undefined),
    error: firstQuery(params.get("error") ?? undefined),
  });

  if (!result.ok) {
    const url = new URL("/entrar", request.url);
    url.searchParams.set("aviso", "google");
    url.searchParams.set("motivo", result.notice);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL("/", request.url));
}
