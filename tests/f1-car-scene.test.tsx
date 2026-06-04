import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children: _children, ...props }: { children?: ReactNode }) => (
    <div {...props} data-testid="mock-three-canvas" />
  )
}));

vi.mock("@react-three/drei", () => {
  const useGLTF = Object.assign(
    vi.fn(() => ({
      scene: {
        clone: () => ({
          traverse: vi.fn()
        })
      }
    })),
    { preload: vi.fn() }
  );

  return {
    Bounds: ({ children }: { children: ReactNode }) => <>{children}</>,
    ContactShadows: () => null,
    Environment: () => null,
    Html: ({ children }: { children: ReactNode }) => <>{children}</>,
    OrbitControls: () => <div data-testid="mock-orbit-controls" />,
    useGLTF
  };
});

import { F1CarScene } from "@/components/builder/f1-car-scene";

describe("F1CarScene", () => {
  it("renders the local 3D car viewer with matching builder setup metadata", () => {
    render(
      <F1CarScene
        config={{
          liveryColor: "neonRed",
          powerUnit: "ferrari",
          aeroPackage: "highDownforce"
        }}
        shouldReduce={false}
      />
    );

    const scene = screen.getByTestId("f1-car-scene");
    expect(scene).toHaveAttribute("data-livery", "neonRed");
    expect(scene).toHaveAttribute("data-power", "ferrari");
    expect(scene).toHaveAttribute("data-aero", "highDownforce");
    expect(screen.getByTestId("mock-three-canvas")).toBeInTheDocument();
    expect(screen.getByText("Neon Red Livery")).toBeInTheDocument();
    expect(screen.getByText("Ferrari PU")).toBeInTheDocument();
    expect(screen.getByText("High Downforce")).toBeInTheDocument();
    expect(screen.getByText("Local GLB material controls")).toBeInTheDocument();
  });
});
