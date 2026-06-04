"use client";

import { Component, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Bounds, ContactShadows, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import type { BuilderConfig } from "@/lib/types";

type SceneProps = {
  config: BuilderConfig;
  shouldReduce: boolean;
};

const MODEL_URL = "/models/f1-2026-car.glb";

const liveryAccent: Record<BuilderConfig["liveryColor"], { color: string; glow: string; label: string }> = {
  electricBlue: {
    color: "#16d9ff",
    glow: "rgba(22, 217, 255, 0.65)",
    label: "Electric Blue Livery"
  },
  neonRed: {
    color: "#ff2b4a",
    glow: "rgba(255, 43, 74, 0.72)",
    label: "Neon Red Livery"
  },
  signalGold: {
    color: "#f9c74f",
    glow: "rgba(249, 199, 79, 0.72)",
    label: "Signal Gold Livery"
  }
};

const powerUnitAccent: Record<BuilderConfig["powerUnit"], { color: string; label: string }> = {
  mercedes: { color: "#55f2d6", label: "Mercedes PU" },
  ferrari: { color: "#ff2b4a", label: "Ferrari PU" },
  redBull: { color: "#f9c74f", label: "Red Bull PU" }
};

const aeroLabel: Record<BuilderConfig["aeroPackage"], string> = {
  balanced: "Balanced Aero",
  highDownforce: "High Downforce",
  lowDrag: "Low Drag"
};

const aeroScale: Record<BuilderConfig["aeroPackage"], [number, number, number]> = {
  balanced: [1, 1, 1],
  highDownforce: [1.08, 1, 1.05],
  lowDrag: [0.94, 0.96, 1.08]
};

function cloneMaterial(material: THREE.Material, config: BuilderConfig) {
  const livery = liveryAccent[config.liveryColor];
  const engine = powerUnitAccent[config.powerUnit];
  const next = material.clone();
  const materialName = material.name.toLowerCase();

  if (next instanceof THREE.MeshStandardMaterial || next instanceof THREE.MeshPhysicalMaterial) {
    if (/tire|tyre|rubber|wheel/.test(materialName)) {
      next.color.set("#050608");
      next.roughness = 0.78;
      next.metalness = 0.08;
    } else if (/engine|exhaust|rear|power|motor|cover/.test(materialName)) {
      next.color.set(engine.color);
      next.emissive.set(engine.color);
      next.emissiveIntensity = 0.22;
      next.metalness = 0.72;
      next.roughness = 0.26;
    } else if (/glass|visor|wind|screen/.test(materialName)) {
      next.color.set("#101827");
      next.opacity = 0.72;
      next.transparent = true;
      next.metalness = 0.2;
      next.roughness = 0.08;
    } else {
      next.color.set(livery.color);
      next.emissive.set(livery.color);
      next.emissiveIntensity = 0.08;
      next.metalness = 0.64;
      next.roughness = 0.2;
    }
  }

  return next;
}

class ModelErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function LocalF1Model({ config, onReady }: { config: BuilderConfig; onReady: () => void }) {
  const gltf = useGLTF(MODEL_URL);
  const car = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    car.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      object.material = Array.isArray(object.material)
        ? object.material.map((material) => cloneMaterial(material, config))
        : cloneMaterial(object.material, config);
    });
    onReady();
  }, [car, config, onReady]);

  return <primitive object={car} rotation={[0, -Math.PI / 2, 0]} scale={aeroScale[config.aeroPackage]} />;
}

function ProceduralFallbackCar({ config }: { config: BuilderConfig }) {
  const livery = liveryAccent[config.liveryColor];
  const engine = powerUnitAccent[config.powerUnit];
  const wingWidth = config.aeroPackage === "highDownforce" ? 3.8 : config.aeroPackage === "lowDrag" ? 3.0 : 3.4;
  const length = config.aeroPackage === "lowDrag" ? 5.5 : 5.1;

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[length, 0.38, 0.78]} />
        <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.08} metalness={0.68} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[1.72, 0.54, 0]}>
        <coneGeometry args={[0.26, 1.85, 32]} />
        <meshStandardMaterial color={livery.color} metalness={0.62} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[-1.35, 0.7, 0]}>
        <boxGeometry args={[1.35, 0.58, 0.88]} />
        <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.16} metalness={0.74} roughness={0.24} />
      </mesh>
      <mesh castShadow position={[0.22, 0.92, 0]}>
        <torusGeometry args={[0.34, 0.035, 10, 48, Math.PI * 1.35]} />
        <meshStandardMaterial color="#e9f8ff" emissive={livery.color} emissiveIntensity={0.16} metalness={0.55} roughness={0.18} />
      </mesh>
      {[
        [2.25, 0.24, 0.92],
        [2.25, 0.24, -0.92],
        [-2.0, 0.24, 0.92],
        [-2.0, 0.24, -0.92]
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} castShadow position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.34, 48]} />
          <meshStandardMaterial color="#050608" roughness={0.82} />
        </mesh>
      ))}
      <mesh castShadow position={[2.75, 0.24, 0]}>
        <boxGeometry args={[0.18, 0.18, wingWidth]} />
        <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.14} metalness={0.58} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[-2.55, 0.86, 0]}>
        <boxGeometry args={[0.18, 0.72, wingWidth * 0.78]} />
        <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.18} metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

function SceneChrome({ config }: { config: BuilderConfig }) {
  const livery = liveryAccent[config.liveryColor];
  const engine = powerUnitAccent[config.powerUnit];

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/85">
      <span className="inline-flex items-center gap-1.5 rounded-full border bg-black/60 px-2 py-1 backdrop-blur" style={{ borderColor: livery.color, color: livery.color }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: livery.color }} />
        {livery.label}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border bg-black/60 px-2 py-1 backdrop-blur" style={{ borderColor: engine.color, color: engine.color }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: engine.color }} />
        {engine.label}
      </span>
      <span className="rounded-full border border-white/20 bg-black/60 px-2 py-1 backdrop-blur">{aeroLabel[config.aeroPackage]}</span>
    </div>
  );
}

export function F1CarScene({ config, shouldReduce }: SceneProps) {
  const accent = liveryAccent[config.liveryColor];
  const [modelReady, setModelReady] = useState(false);
  const handleModelReady = useCallback(() => setModelReady(true), []);
  const handleModelError = useCallback(() => setModelReady(false), []);

  return (
    <div
      className="relative h-[280px] w-full overflow-hidden bg-canvas sm:h-[360px]"
      data-testid="f1-car-scene"
      data-livery={config.liveryColor}
      data-power={config.powerUnit}
      data-aero={config.aeroPackage}
      aria-label="Interactive 360 degree Formula 1 car model viewer"
      style={{ boxShadow: `inset 0 0 42px ${accent.glow}, 0 0 34px ${accent.glow}` }}
    >
      <SceneChrome config={config} />
      <Canvas shadows camera={{ position: [5.2, 2.6, 5.2], fov: 38 }} data-testid="f1-car-canvas">
        <color attach="background" args={["#050711"]} />
        <ambientLight intensity={0.72} />
        <spotLight castShadow position={[4, 6, 5]} angle={0.42} penumbra={0.55} intensity={4.1} />
        <pointLight position={[-4, 2, -4]} intensity={1.2} color={accent.color} />
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs text-white/75 backdrop-blur">Loading local GLB</div>
            </Html>
          }
        >
          <ModelErrorBoundary onError={handleModelError}>
            <Bounds fit clip observe margin={1.25}>
              <LocalF1Model config={config} onReady={handleModelReady} />
            </Bounds>
          </ModelErrorBoundary>
          <Environment preset="city" />
        </Suspense>
        {modelReady ? null : <ProceduralFallbackCar config={config} />}
        <gridHelper args={[9, 18, accent.color, "#172033"]} position={[0, -0.02, 0]} />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.45} scale={8} blur={2.2} far={3} />
        <OrbitControls
          autoRotate={!shouldReduce}
          autoRotateSpeed={0.6}
          enablePan={false}
          minDistance={3.4}
          maxDistance={8.4}
          minPolarAngle={Math.PI / 4.2}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
      <div className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-xs text-white/75 backdrop-blur">
        Local GLB material controls
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
