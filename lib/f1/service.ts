import { F1DataProvider } from "@/lib/f1/provider";
import {
  mockCalendar,
  mockLatestResult,
  mockNextRace,
  mockStandings,
  mockTeams
} from "@/lib/f1/mock-data";
import {
  DataStatus,
  DriverStanding,
  RaceResult,
  RaceWeekend,
  TeamProfile,
  UpcomingRace
} from "@/lib/types";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";
const FALLBACK_SEASONS = ["2026", "2025", "2024"] as const;
const LIVE_STANDINGS_REVALIDATE_SECONDS = 120;
const SCHEDULE_REVALIDATE_SECONDS = 1800;
const FETCH_TIMEOUT_MS = 4500;

type MRDataResponse = {
  MRData?: {
    RaceTable?: {
      season?: string;
      Races?: Array<Record<string, unknown>>;
    };
    StandingsTable?: {
      season?: string;
      StandingsLists?: Array<{
        DriverStandings?: Array<Record<string, unknown>>;
      }>;
    };
  };
};

type FetchPolicy = {
  revalidate: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(obj: Record<string, unknown>, key: string): string {
  const val = obj[key];
  return typeof val === "string" ? val : "";
}

function readNumber(obj: Record<string, unknown>, key: string): number {
  const val = obj[key];
  const parsed = typeof val === "number" ? val : Number(val);
  return Number.isFinite(parsed) ? parsed : 0;
}

function raceToWeekend(race: Record<string, unknown>, season: string): RaceWeekend {
  const circuit = isObject(race.Circuit) ? race.Circuit : {};
  const location = isObject(circuit.Location) ? circuit.Location : {};
  return {
    season,
    round: readString(race, "round"),
    raceName: readString(race, "raceName"),
    date: readString(race, "date"),
    time: readString(race, "time"),
    circuitName: readString(circuit, "circuitName"),
    locality: readString(location, "locality"),
    country: readString(location, "country")
  };
}

function raceToLatestResult(race: Record<string, unknown>, season: string): RaceResult | null {
  const weekend = raceToWeekend(race, season);
  const results = Array.isArray(race.Results) ? race.Results : [];
  const winner = results.find(
    (entry) => isObject(entry) && readString(entry, "position") === "1"
  );
  if (!winner || !isObject(winner)) {
    return null;
  }
  const driver = isObject(winner.Driver) ? winner.Driver : {};
  const constructor = isObject(winner.Constructor) ? winner.Constructor : {};
  return {
    ...weekend,
    winner: {
      fullName: `${readString(driver, "givenName")} ${readString(driver, "familyName")}`.trim(),
      team: readString(constructor, "name"),
      nationality: readString(driver, "nationality")
    }
  };
}

function mapStanding(entry: Record<string, unknown>): DriverStanding {
  const driver = isObject(entry.Driver) ? entry.Driver : {};
  const constructorList = Array.isArray(entry.Constructors) ? entry.Constructors : [];
  const firstConstructor = constructorList.find((c) => isObject(c));
  const constructor = isObject(firstConstructor) ? firstConstructor : {};
  const givenName = readString(driver, "givenName");
  const familyName = readString(driver, "familyName");
  return {
    id: readString(driver, "driverId"),
    position: readNumber(entry, "position"),
    points: readNumber(entry, "points"),
    wins: readNumber(entry, "wins"),
    code: readString(driver, "code") || familyName.slice(0, 3).toUpperCase(),
    givenName,
    familyName,
    nationality: readString(driver, "nationality"),
    team: readString(constructor, "name")
  };
}

function status(
  state: DataStatus["state"],
  season: string,
  source: string,
  message?: string
): DataStatus {
  return { state, season, source, message };
}

function withTimeout<T>(task: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
    task
      .then((result) => resolve(result))
      .catch((error) => reject(error))
      .finally(() => clearTimeout(timer));
  });
}

async function fetchJson(path: string, policy: FetchPolicy, attempt = 0): Promise<MRDataResponse> {
  try {
    const response = await withTimeout(
      fetch(`${BASE_URL}${path}`, {
        next: { revalidate: policy.revalidate }
      }),
      FETCH_TIMEOUT_MS
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as MRDataResponse;
  } catch (error) {
    if (attempt < 1) {
      return fetchJson(path, policy, attempt + 1);
    }
    throw error;
  }
}

async function trySeasons<T>(
  loader: (season: string) => Promise<T | null>,
  fallback: () => T
): Promise<{ data: T; status: DataStatus }> {
  for (const season of FALLBACK_SEASONS) {
    try {
      const loaded = await loader(season);
      if (loaded !== null) {
        const source = season === FALLBACK_SEASONS[0] ? "jolpi-live" : "jolpi-live-fallback-season";
        const state = season === FALLBACK_SEASONS[0] ? "live" : "stale";
        return { data: loaded, status: status(state, season, source) };
      }
    } catch {
      continue;
    }
  }
  return {
    data: fallback(),
    status: status("fallback", FALLBACK_SEASONS[0], "mock-data", "Live feed unavailable")
  };
}

async function loadStandingsBySeason(season: string): Promise<DriverStanding[] | null> {
  const payload = await fetchJson(
    `/${season}/driverStandings.json`,
    { revalidate: LIVE_STANDINGS_REVALIDATE_SECONDS }
  );
  const list = payload.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  if (!list.length) {
    return null;
  }
  const mapped = list.filter(isObject).map(mapStanding);
  return mapped.length ? mapped : null;
}

async function loadCalendarBySeason(season: string): Promise<RaceWeekend[] | null> {
  const payload = await fetchJson(`/${season}.json`, {
    revalidate: SCHEDULE_REVALIDATE_SECONDS
  });
  const races = payload.MRData?.RaceTable?.Races ?? [];
  if (!races.length) {
    return null;
  }
  const mapped = races.filter(isObject).map((race) => raceToWeekend(race, season));
  return mapped.length ? mapped : null;
}

async function loadLatestResultBySeason(season: string): Promise<RaceResult | null> {
  const payload = await fetchJson(`/${season}/last/results.json`, {
    revalidate: LIVE_STANDINGS_REVALIDATE_SECONDS
  });
  const race = payload.MRData?.RaceTable?.Races?.[0];
  if (!isObject(race)) {
    return null;
  }
  return raceToLatestResult(race, season);
}

async function loadNextRaceBySeason(season: string): Promise<UpcomingRace | null> {
  const payload = await fetchJson(`/${season}/next.json`, {
    revalidate: LIVE_STANDINGS_REVALIDATE_SECONDS
  });
  const race = payload.MRData?.RaceTable?.Races?.[0];
  if (!isObject(race)) {
    return null;
  }
  return raceToWeekend(race, season);
}

function standingsToTeams(standings: DriverStanding[]): TeamProfile[] {
  const teamsMap = new Map<string, TeamProfile>();
  standings.forEach((driver) => {
    const id = driver.team.toLowerCase().replace(/\s+/g, "_");
    const existing = teamsMap.get(id);
    if (!existing) {
      teamsMap.set(id, {
        id,
        name: driver.team,
        nationality: "Unknown",
        points: driver.points,
        wins: driver.wins,
        position: teamsMap.size + 1,
        drivers: [
          {
            id: driver.id,
            fullName: `${driver.givenName} ${driver.familyName}`,
            code: driver.code
          }
        ]
      });
      return;
    }
    existing.points += driver.points;
    existing.wins += driver.wins;
    existing.drivers.push({
      id: driver.id,
      fullName: `${driver.givenName} ${driver.familyName}`,
      code: driver.code
    });
  });
  return [...teamsMap.values()].sort((a, b) => b.points - a.points).map((team, index) => ({
    ...team,
    position: index + 1
  }));
}

class JolpiProvider implements F1DataProvider {
  async getLatestResult() {
    const { data, status: dataStatus } = await trySeasons(loadLatestResultBySeason, () => mockLatestResult);
    return { result: data, status: dataStatus };
  }

  async getNextRace() {
    const { data, status: dataStatus } = await trySeasons(loadNextRaceBySeason, () => mockNextRace);
    return { race: data, status: dataStatus };
  }

  async getDriverStandings() {
    const { data, status: dataStatus } = await trySeasons(loadStandingsBySeason, () => mockStandings);
    return { standings: data, status: dataStatus };
  }

  async getRaceCalendar() {
    const { data, status: dataStatus } = await trySeasons(loadCalendarBySeason, () => mockCalendar);
    return { races: data, status: dataStatus };
  }

  async getTeams() {
    const standingsData = await this.getDriverStandings();
    if (standingsData.status.state === "fallback") {
      return { teams: mockTeams, status: standingsData.status };
    }
    return {
      teams: standingsToTeams(standingsData.standings),
      status: standingsData.status
    };
  }
}

const provider = new JolpiProvider();

export function getF1DataProvider(): F1DataProvider {
  return provider;
}

export function __testables__() {
  return {
    trySeasons,
    standingsToTeams,
    loadStandingsBySeason,
    loadCalendarBySeason
  };
}
