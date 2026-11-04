"use server";

import { apiRequest } from "@/lib/api/client";
import { clearSessionCookies, readAccessToken } from "@/lib/auth/session";

export async function logout(): Promise<void> {
  const token = await readAccessToken();
  if (token) {
    try {
      await apiRequest("/api/v1/auth/logout", { method: "POST", token });
    } catch {
      // A sessão local acaba mesmo quando a API não responde.
    }
  }

  await clearSessionCookies();
}
