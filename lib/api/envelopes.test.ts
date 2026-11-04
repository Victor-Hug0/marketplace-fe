import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ApiContractError } from "@/lib/api/failure";
import { cursorEnvelope, parseEnvelope } from "@/lib/api/envelopes";

const itemSchema = z.object({ id: z.string(), name: z.string() });

describe("parseEnvelope", () => {
  it("aceita coleção com cursor", () => {
    const parsed = parseEnvelope(cursorEnvelope(itemSchema), {
      data: [{ id: "1", name: "Caderno" }],
      links: { first: null, last: null, prev: null, next: null },
      meta: {
        path: "/api/v1/products",
        per_page: 20,
        next_cursor: null,
        prev_cursor: null,
      },
    });

    expect(parsed.data).toEqual([{ id: "1", name: "Caderno" }]);
  });

  it("rejeita envelope que não bate com o schema", () => {
    expect(() =>
      parseEnvelope(cursorEnvelope(itemSchema), { data: { id: "1" } }),
    ).toThrow(ApiContractError);
  });
});
