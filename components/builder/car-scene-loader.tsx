"use client";

import dynamic from "next/dynamic";
import type { BuilderConfig } from "@/lib/types";

const F1CarScene = dynamic(
  () => import("@/components/builder/f1-car-scene").then((mod) => mod.F1CarScene),
  {
    ssr: false,
    loading: () => <CarSceneFallback />
  }
);

export function CarSceneLoader({
  config,
  shouldReduce
}: {
  config: BuilderConfig;
  shouldReduce: boolean;
}) {
  return (
    <div
      className="relative mt-6 min-h-[280px] overflow-hidden rounded-md border border-white/15 bg-black/25 sm:min-h-[360px]"
      data-testid="car-scene-wrapper"
    >
      <F1CarScene config={config} shouldReduce={shouldReduce} />
    </div>
  );
}

export function CarSceneFallback() {
  return (
    <div className="flex min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(22,217,255,0.14),transparent_55%)] p-6 text-center sm:min-h-[360px]">
      <div>
        <p className="font-display text-xl text-electric-blue">Loading 3D chassis</p>
        <p className="mt-2 text-sm text-white/65">Preparing the 360-degree garage view.</p>
      </div>
    </div>
  );
}
