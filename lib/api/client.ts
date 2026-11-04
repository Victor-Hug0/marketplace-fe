import { z } from "zod";

import { parseEnvelope } from "@/lib/api/envelopes";
import {
  ApiContractError,
  ApiError,
  ApiUnavailableError,
} from "@/lib/api/failure";
import { parseApiErrorBody } from "@/lib/api/parse-error";

const DEFAULT_TIMEOUT_MS = 10_000;

export type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type ApiRequestInit<T> = {
  method?: ApiMethod;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  token?: string;
  idempotencyKey?: string;
  timeoutMs?: number;
  schema?: z.ZodType<T>;
};

export function apiOrigin(): string {
  const url = process.env.API_URL;
  if (!url) {
    throw new ApiUnavailableError("API_URL não está definida.");
  }
  return url.replace(/\/$/, "");
}

function buildUrl(path: string, query: ApiRequestInit<unknown>["query"]): URL {
  if (!path.startsWith("/")) {
    throw new Error("O caminho da API precisa começar com /.");
  }

  const url = new URL(path, apiOrigin());
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

export async function apiRequest<T>(
  path: string,
  init: ApiRequestInit<T> = {},
): Promise<T> {
  const headers = new Headers({ Accept: "application/json" });
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }
  if (init.idempotencyKey) {
    headers.set("Idempotency-Key", init.idempotencyKey);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, init.query), {
      method: init.method ?? "GET",
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(init.timeoutMs ?? DEFAULT_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof ApiUnavailableError) throw error;
    throw new ApiUnavailableError();
  }

  if (response.status === 204) {
    if (init.schema) throw new ApiContractError();
    return undefined as T;
  }

  const text = await response.text();
  let json: unknown;
  if (text === "") {
    json = undefined;
  } else {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      throw new ApiContractError();
    }
  }

  if (!response.ok) {
    throw new ApiError(
      parseApiErrorBody(
        response.status,
        json,
        response.headers.get("Retry-After"),
      ),
    );
  }

  if (!init.schema) {
    if (text === "") return undefined as T;
    throw new ApiContractError(
      "A resposta de sucesso precisa de um schema na borda.",
    );
  }

  return parseEnvelope(init.schema, json);
}
