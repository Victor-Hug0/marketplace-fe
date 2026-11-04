import { z } from "zod";

import { ApiContractError, type ApiFailure } from "@/lib/api/failure";

const fieldErrorsSchema = z.record(z.string(), z.array(z.string()));

const apiErrorBodySchema = z.object({
  message: z.string().min(1),
  timestamp: z.string().optional(),
  errors: z.union([fieldErrorsSchema, z.array(z.unknown())]).optional(),
});

export function parseRetryAfter(header: string | null): number | null {
  if (header === null) return null;
  const trimmed = header.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

export function parseApiErrorBody(
  status: number,
  body: unknown,
  retryAfterHeader: string | null,
): ApiFailure {
  const parsed = apiErrorBodySchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiContractError();
  }

  const errors =
    parsed.data.errors === undefined || Array.isArray(parsed.data.errors)
      ? {}
      : parsed.data.errors;

  return {
    status,
    message: parsed.data.message,
    errors,
    retryAfter: parseRetryAfter(retryAfterHeader),
  };
}
