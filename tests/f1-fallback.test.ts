import { describe, expect, it } from "vitest";
import { __testables__ } from "@/lib/f1/service";

describe("data fallback ordering", () => {
  it("uses first successful fallback season and marks stale", async () => {
    const { trySeasons } = __testables__();
    const calls: string[] = [];
    const result = await trySeasons(
      async (season) => {
        calls.push(season);
        if (season === "2025") return { ok: true, season };
        throw new Error("down");
      },
      () => ({ ok: false })
    );
    expect(calls).toEqual(["2026", "2025"]);
    expect(result.data).toEqual({ ok: true, season: "2025" });
    expect(result.status.state).toBe("stale");
  });

  it("uses mock fallback after all seasons fail", async () => {
    const { trySeasons } = __testables__();
    const result = await trySeasons(
      async () => {
        throw new Error("down");
      },
      () => ({ source: "mock" })
    );
    expect(result.data).toEqual({ source: "mock" });
    expect(result.status.state).toBe("fallback");
  });
});
