import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BuilderConfig } from "@/lib/types";

vi.mock("@/components/builder/car-scene-loader", () => ({
  CarSceneLoader: ({
    config,
    shouldReduce
  }: {
    config: BuilderConfig;
    shouldReduce: boolean;
  }) => (
    <div
      data-testid="mock-car-scene"
      data-livery={config.liveryColor}
      data-power={config.powerUnit}
      data-aero={config.aeroPackage}
      data-reduced={String(shouldReduce)}
    />
  )
}));

import { BuilderClient } from "@/components/builder/builder-client";

describe("BuilderClient", () => {
  it("renders the 3D scene wrapper and all customization controls", () => {
    render(<BuilderClient />);

    expect(screen.getByTestId("mock-car-scene")).toBeInTheDocument();
    expect(screen.getByLabelText("Livery")).toBeInTheDocument();
    expect(screen.getByLabelText("Power Unit")).toBeInTheDocument();
    expect(screen.getByLabelText("Aero")).toBeInTheDocument();
  });

  it("passes builder selections into the 3D scene", () => {
    render(<BuilderClient />);

    fireEvent.change(screen.getByLabelText("Livery"), { target: { value: "neonRed" } });
    fireEvent.change(screen.getByLabelText("Power Unit"), { target: { value: "redBull" } });
    fireEvent.change(screen.getByLabelText("Aero"), { target: { value: "lowDrag" } });

    const scene = screen.getByTestId("mock-car-scene");
    expect(scene).toHaveAttribute("data-livery", "neonRed");
    expect(scene).toHaveAttribute("data-power", "redBull");
    expect(scene).toHaveAttribute("data-aero", "lowDrag");
  });
});
