import { existsSync, readFileSync } from "node:fs";

import { z } from "zod";

import { apiRequest } from "../lib/api/client";
import { resourceEnvelope } from "../lib/api/envelopes";
import { ApiError, failureCopy } from "../lib/api/failure";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const categoriesSchema = resourceEnvelope(
  z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    }),
  ),
);

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const result = await apiRequest("/api/v1/categories", {
    schema: categoriesSchema,
  });

  console.log(`${result.data.length} categorias`);
  for (const category of result.data) {
    console.log(`- ${category.name} (${category.slug})`);
  }
}

main().catch((error: unknown) => {
  if (error instanceof ApiError) {
    console.error(failureCopy(error).detail);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Falha ao ler o catálogo.");
  }
  process.exitCode = 1;
});
