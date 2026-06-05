import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeClient } from "@/components/home/home-client";
import type { DriverStanding, RaceResult, UpcomingRace } from "@/lib/types";

const latestResult: RaceResult = {
  season: "2026",
  round: "1",
  raceName: "Bahrain Grand Prix",
  date: "2026-03-10",
  time: "18:00:00Z",
  circuitName: "Bahrain International Circuit",
  locality: "Sakhir",
  country: "Bahrain",
  winner: { fullName: "Alex Driver", team: "Team A", nationality: "British" }
};

const nextRace: UpcomingRace = {
  season: "2026",
  round: "2",
  raceName: "Saudi Arabian Grand Prix",
  date: "2026-03-20",
  time: "18:00:00Z",
  circuitName: "Jeddah Corniche Circuit",
  locality: "Jeddah",
  country: "Saudi Arabia"
};

const standings: DriverStanding[] = [
  {
    id: "a",
    position: 1,
    points: 25,
    wins: 1,
    code: "AAA",
    givenName: "Alex",
    familyName: "Driver",
    nationality: "British",
    team: "Mercedes"
  },
  {
    id: "b",
    position: 2,
    points: 18,
    wins: 0,
    code: "BBB",
    givenName: "Blair",
    familyName: "Driver",
    nationality: "French",
    team: "Ferrari"
  },
  {
    id: "c",
    position: 3,
    points: 15,
    wins: 0,
    code: "CCC",
    givenName: "Casey",
    familyName: "Driver",
    nationality: "German",
    team: "McLaren"
  }
];

describe("HomeClient", () => {
  it("renders linked feature cards, race countdown clarity, and top standings preview", () => {
    render(
      <HomeClient
        latestResult={latestResult}
        nextRace={nextRace}
        standings={standings}
        status={{ state: "live", season: "2026", source: "jolpi-live" }}
      />
    );

    expect(screen.getByText("Race starts in")).toBeInTheDocument();
    expect(screen.getByText("Top 3 Drivers")).toBeInTheDocument();
    expect(screen.getByText("Alex Driver")).toBeInTheDocument();
    expect(screen.getByText("Blair Driver")).toBeInTheDocument();
    expect(screen.getByText("Casey Driver")).toBeInTheDocument();
    expect(screen.getByText("AAA")).toHaveStyle("border-color: #00D2BE");
    expect(screen.getByText("BBB")).toHaveStyle("border-color: #DC0000");
    expect(screen.getByText("CCC")).toHaveStyle("border-color: #FF8000");
    expect(screen.getAllByText("→")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Live Stats/i })).toHaveAttribute("href", "/standings");
    expect(screen.getByRole("link", { name: /Custom Cars/i })).toHaveAttribute("href", "/builder");
    expect(screen.getByRole("link", { name: /Interactive/i })).toHaveAttribute("href", "/calendar");
  });
});
