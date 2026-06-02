import { describe, expect, it } from "vitest";
import { simulateCar } from "@/lib/builder/simulate-car";

describe("simulateCar", () => {
  it("changes stats based on power unit and aero package", () => {
    const aggressive = simulateCar({
      liveryColor: "neonRed",
      powerUnit: "ferrari",
      aeroPackage: "lowDrag"
    });
    const control = simulateCar({
      liveryColor: "electricBlue",
      powerUnit: "mercedes",
      aeroPackage: "highDownforce"
    });

    expect(aggressive.topSpeed).toBeGreaterThan(control.topSpeed);
    expect(control.handling).toBeGreaterThan(aggressive.handling);
  });

  it("respects stat bounds", () => {
    const stats = simulateCar({
      liveryColor: "signalGold",
      powerUnit: "redBull",
      aeroPackage: "highDownforce"
    });
    expect(stats.topSpeed).toBeGreaterThanOrEqual(320);
    expect(stats.topSpeed).toBeLessThanOrEqual(360);
    expect(stats.reliability).toBeLessThanOrEqual(100);
  });
});
