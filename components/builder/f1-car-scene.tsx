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
  const highDownforce = config.aeroPackage === "highDownforce";
  const lowDrag = config.aeroPackage === "lowDrag";
  const wingWidth = highDownforce ? 4.35 : lowDrag ? 3.35 : 3.85;
  const rearWingWidth = highDownforce ? 3.55 : lowDrag ? 2.8 : 3.15;
  const length = lowDrag ? 6.25 : highDownforce ? 5.75 : 5.95;
  const rideHeight = lowDrag ? 0.03 : highDownforce ? -0.04 : 0;
  const sidepodWidth = highDownforce ? 0.55 : lowDrag ? 0.36 : 0.45;
  const noseLength = lowDrag ? 2.45 : 2.25;
  const wingStackGap = highDownforce ? 0.18 : 0.13;
  const carbon = "#050608";
  const metal = "#ced7e5";
  const darkGlass = "#101827";
  const tirePositions: [number, number, number][] = [
    [2.23, 0.32, 1.18],
    [2.23, 0.32, -1.18],
    [-2.18, 0.32, 1.18],
    [-2.18, 0.32, -1.18]
  ];

  return (
    <group
      data-testid="built-in-f1-car"
      position={[0, rideHeight, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={[1.06, 1.06, 1.06]}
    >
      <mesh castShadow receiveShadow position={[0, 0.22, 0]} data-testid="f1-floor">
        <boxGeometry args={[length, 0.08, 1.42]} />
        <meshStandardMaterial color={carbon} metalness={0.18} roughness={0.52} />
      </mesh>

      <mesh castShadow position={[0.15, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} data-testid="f1-monocoque">
        <cylinderGeometry args={[0.3, 0.52, 2.85, 40]} />
        <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.08} metalness={0.68} roughness={0.2} />
      </mesh>

      <mesh castShadow position={[1.72, 0.45, 0]} rotation={[0, 0, -Math.PI / 2]} data-testid="f1-long-nose">
        <cylinderGeometry args={[0.08, 0.28, noseLength, 40]} />
        <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.07} metalness={0.7} roughness={0.18} />
      </mesh>

      <mesh castShadow position={[2.92, 0.36, 0]}>
        <boxGeometry args={[0.42, 0.09, 0.26]} />
        <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.1} metalness={0.62} roughness={0.22} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={`sidepod-${side}`} data-testid={`f1-sidepod-${side > 0 ? "right" : "left"}`}>
          <mesh castShadow position={[-0.4, 0.47, side * 0.58]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, sidepodWidth, 1.52, 32]} />
            <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.06} metalness={0.58} roughness={0.24} />
          </mesh>
          <mesh castShadow position={[-0.42, 0.46, side * 0.9]} rotation={[0.18 * side, 0, 0]}>
            <boxGeometry args={[1.25, 0.09, 0.08]} />
            <meshStandardMaterial color={carbon} metalness={0.2} roughness={0.48} />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[-1.45, 0.66, 0]} rotation={[0, 0, Math.PI / 2]} data-testid="f1-engine-cover">
        <cylinderGeometry args={[0.34, 0.62, 1.6, 36]} />
        <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.18} metalness={0.76} roughness={0.22} />
      </mesh>

      <mesh castShadow position={[-1.38, 0.98, 0]}>
        <coneGeometry args={[0.22, 0.72, 28]} />
        <meshStandardMaterial color={livery.color} emissive={engine.color} emissiveIntensity={0.07} metalness={0.62} roughness={0.2} />
      </mesh>

      <mesh castShadow position={[0.28, 0.74, 0]} data-testid="f1-cockpit">
        <sphereGeometry args={[0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={darkGlass} emissive={livery.color} emissiveIntensity={0.09} metalness={0.26} roughness={0.08} />
      </mesh>

      <group data-testid="f1-halo">
        <mesh castShadow position={[0.28, 1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.43, 0.035, 12, 64, Math.PI * 1.45]} />
          <meshStandardMaterial color={metal} emissive={livery.color} emissiveIntensity={0.12} metalness={0.74} roughness={0.18} />
        </mesh>
        <mesh castShadow position={[0.55, 0.87, 0]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.48, 16]} />
          <meshStandardMaterial color={metal} emissive={livery.color} emissiveIntensity={0.12} metalness={0.74} roughness={0.18} />
        </mesh>
      </group>

      <group data-testid="f1-front-wing" position={[3.02, 0.28, 0]}>
        {[0, 1, 2].map((level) => (
          <mesh key={`front-wing-${level}`} castShadow position={[0.02 * level, level * wingStackGap, 0]} rotation={[0, 0.04, 0]}>
            <boxGeometry args={[0.12, 0.045, wingWidth - level * 0.22]} />
            <meshStandardMaterial color={level === 1 ? livery.color : carbon} emissive={level === 1 ? livery.color : carbon} emissiveIntensity={level === 1 ? 0.12 : 0.02} metalness={0.52} roughness={0.24} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <mesh key={`front-endplate-${side}`} castShadow position={[0.02, 0.12, side * wingWidth * 0.52]} rotation={[0, 0, side * 0.08]}>
            <boxGeometry args={[0.18, 0.42, 0.05]} />
            <meshStandardMaterial color={livery.color} emissive={livery.color} emissiveIntensity={0.1} metalness={0.58} roughness={0.22} />
          </mesh>
        ))}
      </group>

      <group data-testid="f1-rear-wing" position={[-2.92, 0.95, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.14, 0.12, rearWingWidth]} />
          <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.18} metalness={0.62} roughness={0.2} />
        </mesh>
        <mesh castShadow position={[0.08, 0.28, 0]} rotation={[0, 0.08, 0]}>
          <boxGeometry args={[0.12, 0.1, rearWingWidth * 0.95]} />
          <meshStandardMaterial color={carbon} emissive={engine.color} emissiveIntensity={0.06} metalness={0.34} roughness={0.34} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={`rear-endplate-${side}`} castShadow position={[0, 0.12, side * rearWingWidth * 0.52]}>
            <boxGeometry args={[0.25, 0.7, 0.06]} />
            <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.15} metalness={0.54} roughness={0.22} />
          </mesh>
        ))}
      </group>

      <group data-testid="f1-diffuser" position={[-2.62, 0.25, 0]}>
        {[-0.42, 0, 0.42].map((offset) => (
          <mesh key={`diffuser-${offset}`} castShadow position={[0, 0.04, offset]} rotation={[0, 0, -0.26]}>
            <boxGeometry args={[0.72, 0.06, 0.06]} />
            <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.16} metalness={0.4} roughness={0.28} />
          </mesh>
        ))}
      </group>

      {tirePositions.map(([x, y, z]) => (
        <group key={`${x}-${z}`} position={[x, y, z]} data-testid="f1-wheel">
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.47, 0.47, 0.36, 64]} />
            <meshStandardMaterial color={carbon} roughness={0.82} metalness={0.08} />
          </mesh>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.035, 12, 48]} />
            <meshStandardMaterial color={metal} emissive={livery.color} emissiveIntensity={0.16} metalness={0.82} roughness={0.16} />
          </mesh>
        </group>
      ))}

      {tirePositions.map(([x, _y, z]) => (
        <group key={`suspension-${x}-${z}`} data-testid="f1-suspension">
          <mesh castShadow position={[x * 0.72, 0.45, z * 0.52]} rotation={[0, z > 0 ? 0.46 : -0.46, 0.08]}>
            <boxGeometry args={[1.14, 0.035, 0.035]} />
            <meshStandardMaterial color={metal} metalness={0.72} roughness={0.22} />
          </mesh>
          <mesh castShadow position={[x * 0.72, 0.28, z * 0.52]} rotation={[0, z > 0 ? 0.4 : -0.4, -0.05]}>
            <boxGeometry args={[1.02, 0.028, 0.028]} />
            <meshStandardMaterial color={carbon} metalness={0.22} roughness={0.38} />
          </mesh>
        </group>
      ))}

      <mesh position={[-2.25, 0.58, 0]} data-testid="f1-engine-glow">
        <sphereGeometry args={[0.18, 24, 12]} />
        <meshStandardMaterial color={engine.color} emissive={engine.color} emissiveIntensity={0.9} transparent opacity={0.55} />
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
              <div className="rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs text-white/75 backdrop-blur">Preparing 360 chassis</div>
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
        {modelReady ? "Imported 3D chassis" : "Built-in 360 chassis"}
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
