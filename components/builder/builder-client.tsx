"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { simulateCar } from "@/lib/builder/simulate-car";
import type { BuilderConfig, BuilderStats } from "@/lib/types";
import { useAdaptiveMotion } from "@/components/hooks/use-adaptive-motion";
import { CarSceneLoader } from "@/components/builder/car-scene-loader";

const STORAGE_KEY = "f1-pulse-builder-config";
const defaultConfig: BuilderConfig = {
  liveryColor: "electricBlue",
  powerUnit: "mercedes",
  aeroPackage: "balanced"
};

const powerMetrics: Record<BuilderConfig["powerUnit"], { powerOutput: number; weightPenalty: number }> = {
  mercedes: { powerOutput: 1042, weightPenalty: 0 },
  ferrari: { powerOutput: 1050, weightPenalty: 2 },
  redBull: { powerOutput: 1038, weightPenalty: -1 }
};

const aeroMetrics: Record<BuilderConfig["aeroPackage"], { downforce: number; topSpeedAdjust: number; weightPenalty: number }> = {
  balanced: { downforce: 72, topSpeedAdjust: 0, weightPenalty: 0 },
  highDownforce: { downforce: 88, topSpeedAdjust: -4, weightPenalty: 3 },
  lowDrag: { downforce: 58, topSpeedAdjust: 6, weightPenalty: -2 }
};

const liveryMetrics: Record<BuilderConfig["liveryColor"], { powerAdjust: number; downforceAdjust: number; weightPenalty: number }> = {
  electricBlue: { powerAdjust: 0, downforceAdjust: 1, weightPenalty: -1 },
  neonRed: { powerAdjust: 2, downforceAdjust: 0, weightPenalty: 0 },
  signalGold: { powerAdjust: 1, downforceAdjust: -1, weightPenalty: 1 }
};

function derivePerformanceMetrics(config: BuilderConfig, stats: BuilderStats) {
  const power = powerMetrics[config.powerUnit];
  const aero = aeroMetrics[config.aeroPackage];
  const livery = liveryMetrics[config.liveryColor];

  return {
    topSpeed: stats.topSpeed + aero.topSpeedAdjust,
    downforce: Math.max(45, Math.min(95, aero.downforce + livery.downforceAdjust)),
    powerOutput: power.powerOutput + livery.powerAdjust,
    weightPenalty: power.weightPenalty + aero.weightPenalty + livery.weightPenalty
  };
}

function AnimatedNumber({
  value,
  suffix = "",
  shouldReduce
}: {
  value: number;
  suffix?: string;
  shouldReduce: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    if (shouldReduce) {
      setDisplayValue(value);
      displayValueRef.current = value;
      return;
    }

    const startValue = displayValueRef.current;
    const start = performance.now();
    const duration = 420;
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + (value - startValue) * eased);
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, shouldReduce]);

  return (
    <span className="font-display text-2xl text-electric-blue">
      {displayValue}
      {suffix}
    </span>
  );
}

function PerformanceMetricChip({
  label,
  value,
  suffix,
  shouldReduce
}: {
  label: string;
  value: number;
  suffix: string;
  shouldReduce: boolean;
}) {
  return (
    <div className="rounded-md border border-electric-blue/25 bg-black/25 px-3 py-3">
      <p className="text-[0.68rem] uppercase tracking-wider text-white/55">{label}</p>
      <AnimatedNumber value={value} suffix={suffix} shouldReduce={shouldReduce} />
    </div>
  );
}

function StatRow({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const max = label === "Top Speed" ? 360 : 100;
  const width = Math.max(5, (value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-white/75">
        <span>{label}</span>
        <span>
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-electric-blue" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function BuilderClient() {
  const [config, setConfig] = useState<BuilderConfig>(defaultConfig);
  const { shouldReduce } = useAdaptiveMotion();
  const stats: BuilderStats = useMemo(() => simulateCar(config), [config]);
  const performanceMetrics = useMemo(() => derivePerformanceMetrics(config, stats), [config, stats]);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as BuilderConfig;
      if (parsed.liveryColor && parsed.powerUnit && parsed.aeroPackage) {
        setConfig(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-4xl text-electric-blue">Visual Car Builder</h1>
        <p className="mt-2 text-white/70">Tune livery, engine, and aero package and get instant race-performance simulation feedback.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="glass-panel rounded-lg p-5">
          <h2 className="font-display text-2xl text-neon-red">Customize</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-white/60">Livery</span>
              <select
                value={config.liveryColor}
                onChange={(event) =>
                  setConfig((prev) => ({ ...prev, liveryColor: event.target.value as BuilderConfig["liveryColor"] }))
                }
                className="focus-ring min-h-11 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2"
              >
                <option value="electricBlue">Electric Blue</option>
                <option value="neonRed">Neon Red</option>
                <option value="signalGold">Signal Gold</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-white/60">Power Unit</span>
              <select
                value={config.powerUnit}
                onChange={(event) =>
                  setConfig((prev) => ({ ...prev, powerUnit: event.target.value as BuilderConfig["powerUnit"] }))
                }
                className="focus-ring min-h-11 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2"
              >
                <option value="mercedes">Mercedes</option>
                <option value="ferrari">Ferrari</option>
                <option value="redBull">Red Bull</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-white/60">Aero</span>
              <select
                value={config.aeroPackage}
                onChange={(event) =>
                  setConfig((prev) => ({ ...prev, aeroPackage: event.target.value as BuilderConfig["aeroPackage"] }))
                }
                className="focus-ring min-h-11 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2"
              >
                <option value="balanced">Balanced</option>
                <option value="highDownforce">High Downforce</option>
                <option value="lowDrag">Low Drag</option>
              </select>
            </label>
          </div>

          <CarSceneLoader config={config} shouldReduce={shouldReduce} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Performance metrics">
            <PerformanceMetricChip label="Top Speed" value={performanceMetrics.topSpeed} suffix=" km/h" shouldReduce={shouldReduce} />
            <PerformanceMetricChip label="Downforce" value={performanceMetrics.downforce} suffix="%" shouldReduce={shouldReduce} />
            <PerformanceMetricChip label="Power Output" value={performanceMetrics.powerOutput} suffix=" bhp" shouldReduce={shouldReduce} />
            <PerformanceMetricChip label="Weight Penalty" value={performanceMetrics.weightPenalty} suffix=" kg" shouldReduce={shouldReduce} />
          </div>
        </article>

        <article className="glass-panel rounded-lg p-5">
          <h2 className="font-display text-2xl text-electric-blue">Real-Time Stats</h2>
          <div className="mt-5 space-y-4">
            <StatRow label="Top Speed" value={stats.topSpeed} suffix=" km/h" />
            <StatRow label="Acceleration" value={stats.acceleration} />
            <StatRow label="Handling" value={stats.handling} />
            <StatRow label="Reliability" value={stats.reliability} />
          </div>
          <p className="mt-5 text-sm text-white/65">
            Simulation blends base chassis performance with power unit and aero trade-offs, then applies bounded balancing.
          </p>
        </article>
      </section>
    </div>
  );
}
