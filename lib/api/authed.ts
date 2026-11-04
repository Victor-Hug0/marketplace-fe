import "server-only";

import { redirect } from "next/navigation";

import { apiRequest, type ApiRequestInit } from "@/lib/api/client";
import { ApiError } from "@/lib/api/failure";
import {
  hasRefreshAttempt,
  readAccessToken,
  readRefreshToken,
} from "@/lib/auth/session";
import { loginPath, renewPath } from "@/lib/auth/next-path";
import { refreshSession } from "@/lib/auth/refresh";

export async function apiRequestFromPage<T>(
  path: string,
  init: ApiRequestInit<T>,
  nextPath: string,
): Promise<T> {
  const token = await readAccessToken();
  if (!token) {
    if (await readRefreshToken()) redirect(renewPath(nextPath));
    redirect(loginPath(nextPath, false));
  }

  try {
    return await apiRequest(path, { ...init, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      if (await hasRefreshAttempt()) redirect(loginPath(nextPath, true));
      redirect(renewPath(nextPath));
    }
    throw error;
  }
}

export async function apiRequestWithSession<T>(
  path: string,
  init: ApiRequestInit<T>,
): Promise<T> {
  let token = await readAccessToken();
  let refreshed = false;

  if (!token) {
    refreshed = true;
    const ok = await refreshSession();
    token = ok ? await readAccessToken() : undefined;
  }

  if (!token) {
    throw new ApiError({
      status: 401,
      message: "Sua sessão terminou.",
      errors: {},
      retryAfter: null,
    });
  }

  try {
    return await apiRequest(path, { ...init, token });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || refreshed) {
      throw error;
    }

    const ok = await refreshSession();
    const nextToken = ok ? await readAccessToken() : undefined;
    if (!nextToken) {
      throw new ApiError({
        status: 401,
        message: "Sua sessão terminou.",
        errors: {},
        retryAfter: null,
      });
    }

    return apiRequest(path, { ...init, token: nextToken });
  }
}
