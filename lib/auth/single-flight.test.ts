import { describe, expect, it } from "vitest";

import { createSingleFlight } from "@/lib/auth/single-flight";

describe("createSingleFlight", () => {
  it("compartilha uma renovação em andamento no mesmo processo", async () => {
    let calls = 0;
    const run = createSingleFlight(async () => {
      calls += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return "renovado";
    });

    const [first, second] = await Promise.all([run(), run()]);

    expect(first).toBe("renovado");
    expect(second).toBe("renovado");
    expect(calls).toBe(1);
  });

  it("permite uma nova chamada depois que a anterior terminou", async () => {
    let calls = 0;
    const run = createSingleFlight(async () => {
      calls += 1;
      return calls;
    });

    await run();
    await run();

    expect(calls).toBe(2);
  });
});
