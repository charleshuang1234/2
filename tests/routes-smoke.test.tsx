import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/f1/service", () => ({
  getF1DataProvider: () => ({
    getLatestResult: async () => ({
      result: {
        season: "2026",
        round: "1",
        raceName: "Bahrain Grand Prix",
        date: "2026-03-10",
        time: "18:00:00Z",
        circuitName: "Bahrain International Circuit",
        locality: "Sakhir",
        country: "Bahrain",
        winner: { fullName: "Alex Driver", team: "Team A", nationality: "British" }
      },
      status: { state: "live", season: "2026", source: "jolpi-live" }
    }),
    getNextRace: async () => ({
      race: {
        season: "2026",
        round: "2",
        raceName: "Saudi Arabian Grand Prix",
        date: "2026-03-20",
        time: "18:00:00Z",
        circuitName: "Jeddah Corniche Circuit",
        locality: "Jeddah",
        country: "Saudi Arabia"
      },
      status: { state: "live", season: "2026", source: "jolpi-live" }
    }),
    getDriverStandings: async () => ({
      standings: [
        {
          id: "a",
          position: 1,
          points: 25,
          wins: 1,
          code: "AAA",
          givenName: "Alex",
          familyName: "Driver",
          nationality: "British",
          team: "Team A"
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
          team: "Team B"
        }
      ],
      status: { state: "live", season: "2026", source: "jolpi-live" }
    }),
    getRaceCalendar: async () => ({
      races: [
        {
          season: "2026",
          round: "1",
          raceName: "Bahrain Grand Prix",
          date: "2026-03-10",
          circuitName: "Bahrain International Circuit",
          locality: "Sakhir",
          country: "Bahrain"
        }
      ],
      status: { state: "live", season: "2026", source: "jolpi-live" }
    }),
    getTeams: async () => ({
      teams: [
        {
          id: "team_a",
          name: "Team A",
          nationality: "British",
          points: 25,
          wins: 1,
          position: 1,
          drivers: [{ id: "a", fullName: "Alex Driver", code: "AAA" }]
        }
      ],
      status: { state: "live", season: "2026", source: "jolpi-live" }
    })
  })
}));

describe("route smoke rendering", () => {
  it("renders home page", async () => {
    const Page = (await import("@/app/page")).default;
    render(await Page());
    expect(screen.getByText("PUSH THE LIMITS")).toBeInTheDocument();
  });

  it("renders standings page", async () => {
    const Page = (await import("@/app/standings/page")).default;
    render(await Page());
    expect(screen.getByText("Head-to-Head Comparison")).toBeInTheDocument();
  });

  it("renders calendar page", async () => {
    const Page = (await import("@/app/calendar/page")).default;
    render(await Page());
    expect(screen.getByText("Season Schedule")).toBeInTheDocument();
  });
});
