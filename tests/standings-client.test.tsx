import { fireEvent, render, screen, within } from "@testing-library/react";
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
  it("renders driver info cards and expands one card at a time", () => {
    render(
      <StandingsClient
        standings={standings}
        status={{ state: "live", season: "2026", source: "jolpi-live" }}
      />
    );

    expect(screen.getByText("Driver Standings")).toBeInTheDocument();
    const cards = screen.getAllByTestId("driver-info-card");
    expect(cards).toHaveLength(3);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(within(cards[0]).getByText("P1")).toBeInTheDocument();
    expect(within(cards[0]).getByText("Alex Alpha")).toBeInTheDocument();
    expect(within(cards[0]).getByText("AAA")).toBeInTheDocument();
    expect(within(cards[0]).getByText("Team A")).toBeInTheDocument();
    expect(within(cards[0]).getByText("British")).toBeInTheDocument();
    expect(within(cards[0]).getByText("120")).toBeInTheDocument();
    expect(within(cards[0]).getByText("4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Alex Alpha/i }));
    expect(screen.getByTestId("driver-expanded-details")).toHaveTextContent("Championship");
    expect(screen.getByTestId("driver-expanded-details")).toHaveTextContent("Championship leader");

    fireEvent.click(screen.getByRole("button", { name: /Blair Beta/i }));
    expect(screen.getByTestId("driver-expanded-details")).toHaveTextContent("22 points behind");
    expect(screen.queryByText("Championship leader")).not.toBeInTheDocument();
  });

  it("keeps head-to-head behavior when selections change", () => {
    render(
      <StandingsClient
        standings={standings}
        status={{ state: "live", season: "2026", source: "jolpi-live" }}
      />
    );

    expect(screen.getByText(/Delta:/)).toHaveTextContent("+22 points");

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "c" } });
    expect(screen.getByText(/Delta:/)).toHaveTextContent("+44 points");
  });
});
