"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { simulateCar } from "@/lib/builder/simulate-car";
import { BuilderConfig, BuilderStats } from "@/lib/types";
import { useAdaptiveMotion } from "@/components/hooks/use-adaptive-motion";

const STORAGE_KEY = "f1-pulse-builder-config";
const defaultConfig: BuilderConfig = {
  liveryColor: "electricBlue",
  powerUnit: "mercedes",
  aeroPackage: "balanced"
};

function colorClass(color: BuilderConfig["liveryColor"]) {
  if (color === "neonRed") return "from-neon-red/80 to-neon-red/20 shadow-neonRed";
  if (color === "signalGold") return "from-signal-gold/80 to-signal-gold/20";
  return "from-electric-blue/80 to-electric-blue/20 shadow-neonBlue";
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
                className="focus-ring w-full rounded-md border border-white/20 bg-black/40 px-3 py-2"
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
                className="focus-ring w-full rounded-md border border-white/20 bg-black/40 px-3 py-2"
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
                className="focus-ring w-full rounded-md border border-white/20 bg-black/40 px-3 py-2"
              >
                <option value="balanced">Balanced</option>
                <option value="highDownforce">High Downforce</option>
                <option value="lowDrag">Low Drag</option>
              </select>
            </label>
          </div>

          <motion.div
            animate={shouldReduce ? undefined : { opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mt-6 overflow-hidden rounded-md border border-white/15 bg-black/25 p-6"
          >
            <div className="relative mx-auto h-40 max-w-xl">
              <div className="absolute left-1/2 top-1/2 h-4 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />
              <div
                className={`absolute left-1/2 top-1/2 h-12 w-60 -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-gradient-to-r ${colorClass(config.liveryColor)}`}
              />
              <div className="absolute left-[18%] top-[58%] h-10 w-10 rounded-full border-2 border-white/30 bg-black" />
              <div className="absolute right-[18%] top-[58%] h-10 w-10 rounded-full border-2 border-white/30 bg-black" />
              <div className="absolute left-[30%] top-[23%] h-5 w-14 rounded bg-white/25" />
              <div className="absolute right-[30%] top-[23%] h-5 w-14 rounded bg-white/25" />
            </div>
          </motion.div>
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
