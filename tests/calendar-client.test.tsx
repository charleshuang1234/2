import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CalendarClient } from "@/components/calendar/calendar-client";
import type { RaceWeekend, TeamProfile } from "@/lib/types";

const races: RaceWeekend[] = [
  {
    season: "2026",
    round: "1",
    raceName: "Bahrain Grand Prix",
    date: "2026-03-10",
    time: "18:00:00Z",
    circuitName: "Bahrain International Circuit",
    locality: "Sakhir",
    country: "Bahrain"
  }
];

const teams: TeamProfile[] = [
  {
    id: "team_a",
    name: "Team A",
    nationality: "British",
    points: 25,
    wins: 1,
    position: 1,
    drivers: [{ id: "a", fullName: "Alex Driver", code: "AAA" }]
  }
];

describe("CalendarClient", () => {
  it("renders race cards with compact round, country, date, and location context", () => {
    render(
      <CalendarClient
        races={races}
        teams={teams}
        status={{ state: "live", season: "2026", source: "jolpi-live" }}
      />
    );

    expect(screen.getByText("Round 1")).toBeInTheDocument();
    expect(screen.getByText("Bahrain")).toBeInTheDocument();
    expect(screen.getByText(/Date/)).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText(/Bahrain International Circuit/)).toBeInTheDocument();
  });
});
