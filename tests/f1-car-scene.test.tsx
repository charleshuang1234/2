import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const useGLTFMock = vi.hoisted(() => vi.fn());

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: { children?: ReactNode }) => (
    <div {...props} data-testid="mock-three-canvas">
      {children}
    </div>
  )
}));

vi.mock("@react-three/drei", () => {
  const useGLTF = Object.assign(useGLTFMock, { preload: vi.fn() });

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
  beforeEach(() => {
    useGLTFMock.mockImplementation(() => {
      throw new Error("Model not available in test");
    });
  });

  it("renders the built-in F1 car with matching builder setup metadata", () => {
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
    expect(screen.getByText("360 F1 chassis")).toBeInTheDocument();
    expect(screen.getByTestId("built-in-f1-car")).toBeInTheDocument();
    expect(screen.getByTestId("f1-long-nose")).toBeInTheDocument();
    expect(screen.getByTestId("f1-front-wing")).toBeInTheDocument();
    expect(screen.getByTestId("f1-rear-wing")).toBeInTheDocument();
    expect(screen.getByTestId("f1-halo")).toBeInTheDocument();
    expect(screen.getAllByTestId("f1-wheel")).toHaveLength(4);
  });
});
