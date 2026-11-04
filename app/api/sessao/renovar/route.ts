import { NextResponse, type NextRequest } from "next/server";

import { loginPath, safeNextPath } from "@/lib/auth/next-path";
import { refreshSession } from "@/lib/auth/refresh";
import { clearSessionCookies, markRefreshAttempt } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
  const renewed = await refreshSession();

  if (!renewed) {
    await clearSessionCookies();
    return NextResponse.redirect(
      new URL(loginPath(nextPath, true), request.url),
    );
  }

  await markRefreshAttempt();
  return NextResponse.redirect(new URL(nextPath, request.url));
}
