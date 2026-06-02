export type DataState = "live" | "fallback" | "stale";

export interface DataStatus {
  state: DataState;
  season: string;
  source: string;
  message?: string;
}

export interface DriverStanding {
  id: string;
  position: number;
  points: number;
  wins: number;
  code: string;
  givenName: string;
  familyName: string;
  nationality: string;
  team: string;
}

export interface RaceResult {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  circuitName: string;
  locality: string;
  country: string;
  winner: {
    fullName: string;
    team: string;
    nationality: string;
  };
}

export interface UpcomingRace {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  circuitName: string;
  locality: string;
  country: string;
}

export interface RaceWeekend {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  circuitName: string;
  locality: string;
  country: string;
}

export interface TeamProfile {
  id: string;
  name: string;
  nationality: string;
  points: number;
  wins: number;
  position: number;
  drivers: Array<{
    id: string;
    fullName: string;
    code: string;
  }>;
}

export type LiveryColor = "electricBlue" | "neonRed" | "signalGold";
export type PowerUnit = "mercedes" | "ferrari" | "redBull";
export type AeroPackage = "balanced" | "highDownforce" | "lowDrag";

export interface BuilderConfig {
  liveryColor: LiveryColor;
  powerUnit: PowerUnit;
  aeroPackage: AeroPackage;
}

export interface BuilderStats {
  topSpeed: number;
  acceleration: number;
  handling: number;
  reliability: number;
}

export interface HeadToHeadMetrics {
  points: number;
  wins: number;
  position: number;
}

export interface HeadToHeadResult {
  a: HeadToHeadMetrics;
  b: HeadToHeadMetrics;
  delta: {
    points: number;
    wins: number;
    position: number;
  };
}
