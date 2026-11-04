import { z } from "zod";

import { ApiContractError } from "@/lib/api/failure";

export const cursorLinksSchema = z.object({
  first: z.string().nullable(),
  last: z.string().nullable(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

export const cursorMetaSchema = z.object({
  path: z.string(),
  per_page: z.number().int().positive(),
  next_cursor: z.string().nullable(),
  prev_cursor: z.string().nullable(),
});

export function resourceEnvelope<T extends z.ZodType>(data: T) {
  return z.object({
    data,
    message: z.string().optional(),
  });
}

export function cursorEnvelope<T extends z.ZodType>(item: T) {
  return z.object({
    data: z.array(item),
    links: cursorLinksSchema,
    meta: cursorMetaSchema,
  });
}

export function userEnvelope<T extends z.ZodType>(user: T) {
  return z.object({
    message: z.string().optional(),
    user,
  });
}

export const tokenPairSchema = z.object({
  message: z.string().optional(),
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

export function productDetailEnvelope<T extends z.ZodType, B extends z.ZodType>(
  data: T,
  buyBox: B,
) {
  return z.object({
    data,
    buy_box: buyBox.nullable(),
  });
}

export function storefrontEnvelope<T extends z.ZodType, P extends z.ZodType>(
  data: T,
  product: P,
) {
  return z.object({
    data,
    products: z.array(product),
  });
}

export function parseEnvelope<T>(schema: z.ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiContractError();
  }
  return parsed.data;
}
