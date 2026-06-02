import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StandingsClient } from "@/components/standings/standings-client";
import { DriverStanding } from "@/lib/types";

const standings: DriverStanding[] = [
  {
    id: "a",
    position: 1,
    points: 120,
    wins: 4,
    code: "AAA",
    givenName: "Alex",
    familyName: "Alpha",
    nationality: "British",
    team: "Team A"
  },
  {
    id: "b",
    position: 2,
    points: 98,
    wins: 2,
    code: "BBB",
    givenName: "Blair",
    familyName: "Beta",
    nationality: "French",
    team: "Team B"
  },
  {
    id: "c",
    position: 3,
    points: 76,
    wins: 1,
    code: "CCC",
    givenName: "Casey",
    familyName: "Gamma",
    nationality: "German",
    team: "Team C"
  }
];

describe("StandingsClient", () => {
  it("renders head-to-head and updates when selections change", () => {
    render(
      <StandingsClient
        standings={standings}
        status={{ state: "live", season: "2026", source: "jolpi-live" }}
      />
    );

    expect(screen.getByText("Driver Standings")).toBeInTheDocument();
    expect(screen.getByText(/Delta:/)).toHaveTextContent("+22 points");

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "c" } });
    expect(screen.getByText(/Delta:/)).toHaveTextContent("+44 points");
  });
});
