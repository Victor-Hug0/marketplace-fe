export const ACCESS_COOKIE = "emall_access";
export const REFRESH_COOKIE = "emall_refresh";
export const OAUTH_STATE_COOKIE = "emall_oauth_state";
export const IDEMPOTENCY_COOKIE = "emall_idem";

/** Marca que esta navegação já tentou renovar a sessão uma vez. Não guarda token. */
export const REFRESH_ATTEMPT_COOKIE = "emall_refresh_attempt";

export const ACCESS_MAX_AGE_SECONDS = 60 * 60;
export const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;
export const REFRESH_ATTEMPT_MAX_AGE_SECONDS = 15;

export type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge: number;
};

export function sessionCookieOptions(
  maxAgeSeconds: number,
): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
