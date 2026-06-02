import { BuilderConfig, BuilderStats } from "@/lib/types";

const baseStats: BuilderStats = {
  topSpeed: 336,
  acceleration: 88,
  handling: 84,
  reliability: 80
};

export function simulateCar(config: BuilderConfig): BuilderStats {
  let stats: BuilderStats = { ...baseStats };

  if (config.powerUnit === "mercedes") {
    stats.topSpeed += 2;
    stats.reliability += 4;
  }
  if (config.powerUnit === "ferrari") {
    stats.acceleration += 4;
    stats.topSpeed += 1;
    stats.reliability -= 2;
  }
  if (config.powerUnit === "redBull") {
    stats.handling += 3;
    stats.acceleration += 2;
  }

  if (config.aeroPackage === "highDownforce") {
    stats.handling += 6;
    stats.topSpeed -= 3;
    stats.reliability += 2;
  }
  if (config.aeroPackage === "lowDrag") {
    stats.topSpeed += 5;
    stats.handling -= 3;
  }

  if (config.liveryColor === "electricBlue") {
    stats.reliability += 1;
  }
  if (config.liveryColor === "neonRed") {
    stats.acceleration += 1;
  }
  if (config.liveryColor === "signalGold") {
    stats.topSpeed += 1;
  }

  return {
    topSpeed: clamp(stats.topSpeed, 320, 360),
    acceleration: clamp(stats.acceleration, 70, 100),
    handling: clamp(stats.handling, 70, 100),
    reliability: clamp(stats.reliability, 65, 100)
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
