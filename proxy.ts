import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { loginPath } from "@/lib/auth/next-path";

export function proxy(request: NextRequest) {
  if (request.cookies.get(ACCESS_COOKIE)?.value) {
    return NextResponse.next();
  }

  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.redirect(
    new URL(loginPath(nextPath, false), request.url),
  );
}

export const config = {
  matcher: [
    "/carrinho/:path*",
    "/checkout/:path*",
    "/pedidos/:path*",
    "/conta/:path*",
    "/vendedor/:path*",
    "/admin/:path*",
  ],
};
