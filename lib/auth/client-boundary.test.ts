import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { clientSourceLeaksSession } from "@/lib/auth/client-boundary";

function listSources(directory: string, files: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    if (
      entry === "node_modules" ||
      entry === ".next" ||
      entry === "coverage" ||
      entry === "generated"
    ) {
      continue;
    }

    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      listSources(fullPath, files);
      continue;
    }

    if (fullPath.endsWith(".test.ts") || fullPath.endsWith(".test.tsx")) {
      continue;
    }

    if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("fronteira do cliente", () => {
  it("aponta vazamento de token em componente cliente", () => {
    const source = `"use client";\nconst cookie = "emall_access";\n`;
    expect(clientSourceLeaksSession(source)).toBe(true);
    expect(clientSourceLeaksSession("export const ok = 1;\n")).toBe(false);
  });

  it("não encontra access token nos componentes cliente do app", () => {
    const root = path.resolve(import.meta.dirname, "../..");
    const leaks = listSources(root).filter((file) =>
      clientSourceLeaksSession(readFileSync(file, "utf8")),
    );

    expect(leaks).toEqual([]);
  });
});
