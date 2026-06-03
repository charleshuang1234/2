import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F1CarScene } from "@/components/builder/f1-car-scene";

describe("F1CarScene", () => {
  it("renders the hosted realistic F1 model viewer with builder setup metadata", () => {
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
    expect(screen.getByTitle("F1 2026 realistic 3D model viewer")).toHaveAttribute(
      "src",
      "https://fetchcfd.com/threeDViewGltf-embed-project/4846-f1-2026-car-3d-model"
    );
    expect(screen.getByTitle("F1 2026 realistic 3D model viewer")).toHaveStyle({
      filter: "saturate(1.28) contrast(1.06)"
    });
    expect(screen.getByTestId("livery-color-wash")).toHaveStyle({
      backgroundColor: "rgba(255, 43, 74, 0.2)"
    });
    expect(screen.getByTestId("engine-color-accent")).toHaveStyle({
      background: "radial-gradient(circle, rgba(255, 43, 74, 0.88), transparent 68%)"
    });
    expect(screen.getByText("Model: FetchCFD / Nimaxo")).toBeInTheDocument();
  });
});
