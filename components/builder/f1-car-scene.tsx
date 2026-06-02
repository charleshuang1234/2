"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import type { BuilderConfig } from "@/lib/types";

type SceneProps = {
  config: BuilderConfig;
  shouldReduce: boolean;
};

const liveryPalette: Record<
  BuilderConfig["liveryColor"],
  { body: string; trim: string; glow: string }
> = {
  electricBlue: { body: "#1164ff", trim: "#16d9ff", glow: "#16d9ff" },
  neonRed: { body: "#c41230", trim: "#ff2b4a", glow: "#ff2b4a" },
  signalGold: { body: "#d69a16", trim: "#f9c74f", glow: "#f9c74f" }
};

const powerUnitAccent: Record<BuilderConfig["powerUnit"], string> = {
  mercedes: "#55f2d6",
  ferrari: "#ff2b4a",
  redBull: "#f9c74f"
};

const aeroScale: Record<
  BuilderConfig["aeroPackage"],
  { wingWidth: number; wingDepth: number; bodyLength: number; sidepodWidth: number }
> = {
  balanced: { wingWidth: 3.7, wingDepth: 0.34, bodyLength: 4.25, sidepodWidth: 1.05 },
  highDownforce: { wingWidth: 4.15, wingDepth: 0.46, bodyLength: 4.05, sidepodWidth: 1.18 },
  lowDrag: { wingWidth: 3.3, wingDepth: 0.26, bodyLength: 4.55, sidepodWidth: 0.9 }
};

function Tire({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.28, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.34, 36]} />
        <meshStandardMaterial color="#050505" roughness={0.62} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.18, 0.18, 0.035, 32]} />
        <meshStandardMaterial color="#d7dde8" roughness={0.28} metalness={0.75} />
      </mesh>
    </group>
  );
}

function Suspension({ z }: { z: number }) {
  return (
    <group position={[0, 0.34, z]}>
      <mesh rotation={[0, 0, 0.16]}>
        <boxGeometry args={[3.35, 0.045, 0.045]} />
        <meshStandardMaterial color="#151923" roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh rotation={[0, 0, -0.16]}>
        <boxGeometry args={[3.35, 0.045, 0.045]} />
        <meshStandardMaterial color="#151923" roughness={0.45} metalness={0.6} />
      </mesh>
    </group>
  );
}

function F1CarModel({ config, shouldReduce }: SceneProps) {
  const palette = liveryPalette[config.liveryColor];
  const aero = aeroScale[config.aeroPackage];
  const engineAccent = powerUnitAccent[config.powerUnit];

  return (
    <group rotation={[0, shouldReduce ? -0.35 : -0.55, 0]}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[4.9, 0.06, 6.1]} />
        <meshStandardMaterial color="#050914" roughness={0.75} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.53, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.42, aero.bodyLength]} />
        <meshStandardMaterial color={palette.body} roughness={0.2} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.52, -2.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.33, 1.45, 5]} />
        <meshStandardMaterial color={palette.body} roughness={0.2} metalness={0.52} />
      </mesh>
      <mesh position={[0, 0.78, 0.12]} castShadow>
        <sphereGeometry args={[0.34, 32, 16]} />
        <meshStandardMaterial color="#101622" roughness={0.18} metalness={0.45} />
      </mesh>

      <mesh position={[0, 1.04, 0.02]} castShadow>
        <torusGeometry args={[0.48, 0.035, 12, 48, Math.PI * 1.24]} />
        <meshStandardMaterial color="#090d15" roughness={0.24} metalness={0.74} />
      </mesh>

      <mesh position={[-0.78, 0.48, 0.35]} castShadow>
        <boxGeometry args={[aero.sidepodWidth, 0.38, 1.55]} />
        <meshStandardMaterial color={palette.body} roughness={0.24} metalness={0.5} />
      </mesh>
      <mesh position={[0.78, 0.48, 0.35]} castShadow>
        <boxGeometry args={[aero.sidepodWidth, 0.38, 1.55]} />
        <meshStandardMaterial color={palette.body} roughness={0.24} metalness={0.5} />
      </mesh>

      <mesh position={[0, 0.78, 1.75]} castShadow>
        <boxGeometry args={[0.68, 0.74, 1.1]} />
        <meshStandardMaterial color={palette.body} roughness={0.22} metalness={0.58} />
      </mesh>
      <mesh position={[0, 1.18, 2.25]} castShadow>
        <boxGeometry args={[0.72, 0.16, 0.45]} />
        <meshStandardMaterial color={engineAccent} emissive={engineAccent} emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[0, 0.5, -2.85]} castShadow receiveShadow>
        <boxGeometry args={[aero.wingWidth, 0.1, aero.wingDepth]} />
        <meshStandardMaterial color={palette.trim} emissive={palette.glow} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 0.72, 2.83]} castShadow receiveShadow>
        <boxGeometry args={[aero.wingWidth * 0.82, 0.12, aero.wingDepth * 1.08]} />
        <meshStandardMaterial color={palette.trim} emissive={palette.glow} emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[-1.35, 0.65, 2.8]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.25]} />
        <meshStandardMaterial color="#111827" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[1.35, 0.65, 2.8]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.25]} />
        <meshStandardMaterial color="#111827" metalness={0.45} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.86, -0.85]} castShadow>
        <boxGeometry args={[0.16, 0.08, 2.05]} />
        <meshStandardMaterial color={palette.trim} emissive={palette.glow} emissiveIntensity={0.42} />
      </mesh>
      <mesh position={[-0.42, 0.64, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.05, 2.65]} />
        <meshStandardMaterial color={palette.trim} emissive={palette.glow} emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0.42, 0.64, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.05, 2.65]} />
        <meshStandardMaterial color={palette.trim} emissive={palette.glow} emissiveIntensity={0.28} />
      </mesh>

      <Suspension z={-1.95} />
      <Suspension z={1.85} />
      <Tire x={-1.72} z={-1.95} />
      <Tire x={1.72} z={-1.95} />
      <Tire x={-1.72} z={1.85} />
      <Tire x={1.72} z={1.85} />
    </group>
  );
}

export function F1CarScene({ config, shouldReduce }: SceneProps) {
  return (
    <div
      className="h-[280px] w-full sm:h-[360px]"
      data-testid="f1-car-scene"
      data-livery={config.liveryColor}
      data-power={config.powerUnit}
      data-aero={config.aeroPackage}
      aria-label="Interactive 360 degree 3D Formula 1 car viewer"
    >
      <Canvas shadows camera={{ position: [4.8, 3.1, 5.6], fov: 42 }}>
        <color attach="background" args={["#05070f"]} />
        <ambientLight intensity={0.65} />
        <directionalLight
          castShadow
          position={[5, 7, 4]}
          intensity={2.1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 2, -4]} intensity={1.2} color={liveryPalette[config.liveryColor].glow} />
        <F1CarModel config={config} shouldReduce={shouldReduce} />
        <Grid
          position={[0, 0.08, 0]}
          args={[8, 8]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor="#163044"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#16d9ff"
          fadeDistance={9}
          fadeStrength={1.5}
        />
        <ContactShadows position={[0, 0.09, 0]} opacity={0.45} scale={7} blur={2.5} far={2.5} />
        <OrbitControls
          autoRotate={!shouldReduce}
          autoRotateSpeed={0.7}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={4.2}
          maxDistance={8}
          minPolarAngle={Math.PI / 4.8}
          maxPolarAngle={Math.PI / 2.15}
        />
      </Canvas>
    </div>
  );
}
