import "server-only";

import { z } from "zod";

import { apiRequestWithSession } from "@/lib/api/authed";
import { userEnvelope } from "@/lib/api/envelopes";
import { readAccessToken, readRefreshToken } from "@/lib/auth/session";

const sessionUserSchema = z.object({
  name: z.string(),
  email_verified_at: z.string().nullable().optional(),
});

export type SessionUser = {
  name: string;
  emailVerified: boolean;
};

export async function readSessionUser(): Promise<SessionUser | null> {
  const access = await readAccessToken();
  const refresh = await readRefreshToken();
  if (!access && !refresh) return null;

  try {
    const body = await apiRequestWithSession("/api/v1/users/me", {
      schema: userEnvelope(sessionUserSchema),
    });
    return {
      name: body.user.name,
      emailVerified: Boolean(body.user.email_verified_at),
    };
  } catch {
    return null;
  }
}

export async function hasSessionCookie(): Promise<boolean> {
  const access = await readAccessToken();
  const refresh = await readRefreshToken();
  return Boolean(access || refresh);
}
