"use client";

import type { BuilderConfig } from "@/lib/types";

type SceneProps = {
  config: BuilderConfig;
  shouldReduce: boolean;
};

const MODEL_EMBED_URL = "https://fetchcfd.com/threeDViewGltf-embed-project/4846-f1-2026-car-3d-model";
const MODEL_SOURCE_URL = "https://fetchcfd.com/view-project/4846-f1-2026-car-3d-model";

const liveryAccent: Record<BuilderConfig["liveryColor"], { glow: string; label: string }> = {
  electricBlue: { glow: "rgba(22, 217, 255, 0.65)", label: "Electric Blue" },
  neonRed: { glow: "rgba(255, 43, 74, 0.72)", label: "Neon Red" },
  signalGold: { glow: "rgba(249, 199, 79, 0.72)", label: "Signal Gold" }
};

const powerUnitLabel: Record<BuilderConfig["powerUnit"], string> = {
  mercedes: "Mercedes PU",
  ferrari: "Ferrari PU",
  redBull: "Red Bull PU"
};

const aeroLabel: Record<BuilderConfig["aeroPackage"], string> = {
  balanced: "Balanced Aero",
  highDownforce: "High Downforce",
  lowDrag: "Low Drag"
};

export function F1CarScene({ config, shouldReduce }: SceneProps) {
  const accent = liveryAccent[config.liveryColor];

  return (
    <div
      className="relative h-[280px] w-full overflow-hidden bg-canvas sm:h-[360px]"
      data-testid="f1-car-scene"
      data-livery={config.liveryColor}
      data-power={config.powerUnit}
      data-aero={config.aeroPackage}
      aria-label="Interactive 360 degree hosted Formula 1 car model viewer"
      style={{
        boxShadow: `inset 0 0 42px ${accent.glow}, 0 0 34px ${accent.glow}`
      }}
    >
      <iframe
        title="F1 2026 realistic 3D model viewer"
        src={MODEL_EMBED_URL}
        className="h-full w-full border-0"
        allow="autoplay; fullscreen; vr"
        loading="lazy"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_28%,transparent_72%,rgba(255,255,255,0.08))]"
      />

      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/85">
        <span className="rounded-full border border-white/20 bg-black/60 px-2 py-1 backdrop-blur">
          {accent.label}
        </span>
        <span className="rounded-full border border-white/20 bg-black/60 px-2 py-1 backdrop-blur">
          {powerUnitLabel[config.powerUnit]}
        </span>
        <span className="rounded-full border border-white/20 bg-black/60 px-2 py-1 backdrop-blur">
          {aeroLabel[config.aeroPackage]}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-xs text-white/75 backdrop-blur">
        <a
          href={MODEL_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="focus-ring rounded-sm"
        >
          Model: FetchCFD / Nimaxo
        </a>
      </div>

      {shouldReduce ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.glow}, transparent)`
          }}
        />
      )}
    </div>
  );
}
