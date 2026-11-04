import "server-only";

import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  IDEMPOTENCY_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE_SECONDS,
  REFRESH_ATTEMPT_COOKIE,
  REFRESH_ATTEMPT_MAX_AGE_SECONDS,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from "@/lib/auth/cookies";

export async function readAccessToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value;
}

export async function readRefreshToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value;
}

export async function writeSession(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  const jar = await cookies();
  jar.set(
    ACCESS_COOKIE,
    tokens.accessToken,
    sessionCookieOptions(ACCESS_MAX_AGE_SECONDS),
  );
  jar.set(
    REFRESH_COOKIE,
    tokens.refreshToken,
    sessionCookieOptions(REFRESH_MAX_AGE_SECONDS),
  );
}

export async function writeOAuthState(state: string): Promise<void> {
  const jar = await cookies();
  jar.set(
    OAUTH_STATE_COOKIE,
    state,
    sessionCookieOptions(OAUTH_STATE_MAX_AGE_SECONDS),
  );
}

export async function clearSessionCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(IDEMPOTENCY_COOKIE);
  jar.delete(OAUTH_STATE_COOKIE);
  jar.delete(REFRESH_ATTEMPT_COOKIE);
}

export async function hasRefreshAttempt(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(REFRESH_ATTEMPT_COOKIE)?.value === "1";
}

export async function markRefreshAttempt(): Promise<void> {
  const jar = await cookies();
  jar.set(
    REFRESH_ATTEMPT_COOKIE,
    "1",
    sessionCookieOptions(REFRESH_ATTEMPT_MAX_AGE_SECONDS),
  );
}
