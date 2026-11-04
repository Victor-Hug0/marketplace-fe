import "server-only";

import { apiRequest } from "@/lib/api/client";
import { tokenPairSchema } from "@/lib/api/envelopes";
import { ApiError } from "@/lib/api/failure";
import { createSingleFlight } from "@/lib/auth/single-flight";
import {
  clearSessionCookies,
  readRefreshToken,
  writeSession,
} from "@/lib/auth/session";

async function refreshOnce(): Promise<boolean> {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) return false;

  try {
    const pair = await apiRequest("/api/v1/auth/refresh", {
      method: "POST",
      token: refreshToken,
      schema: tokenPairSchema,
    });
    await writeSession({
      accessToken: pair.access_token,
      refreshToken: pair.refresh_token,
    });
    return true;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      await clearSessionCookies();
      return false;
    }
    throw error;
  }
}

const refreshSingleFlight = createSingleFlight(refreshOnce);

export function refreshSession(): Promise<boolean> {
  return refreshSingleFlight();
}
