import {
  DriverStanding,
  RaceResult,
  RaceWeekend,
  TeamProfile,
  UpcomingRace
} from "@/lib/types";

export const mockStandings: DriverStanding[] = [
  {
    id: "max_verstappen",
    position: 1,
    points: 226,
    wins: 7,
    code: "VER",
    givenName: "Max",
    familyName: "Verstappen",
    nationality: "Dutch",
    team: "Red Bull"
  },
  {
    id: "charles_leclerc",
    position: 2,
    points: 184,
    wins: 3,
    code: "LEC",
    givenName: "Charles",
    familyName: "Leclerc",
    nationality: "Monacan",
    team: "Ferrari"
  },
  {
    id: "lando_norris",
    position: 3,
    points: 173,
    wins: 2,
    code: "NOR",
    givenName: "Lando",
    familyName: "Norris",
    nationality: "British",
    team: "McLaren"
  },
  {
    id: "george_russell",
    position: 4,
    points: 149,
    wins: 1,
    code: "RUS",
    givenName: "George",
    familyName: "Russell",
    nationality: "British",
    team: "Mercedes"
  },
  {
    id: "lewis_hamilton",
    position: 5,
    points: 132,
    wins: 0,
    code: "HAM",
    givenName: "Lewis",
    familyName: "Hamilton",
    nationality: "British",
    team: "Mercedes"
  },
  {
    id: "carlos_sainz",
    position: 6,
    points: 124,
    wins: 1,
    code: "SAI",
    givenName: "Carlos",
    familyName: "Sainz",
    nationality: "Spanish",
    team: "Ferrari"
  }
];

export const mockLatestResult: RaceResult = {
  season: "2026",
  round: "8",
  raceName: "Monaco Grand Prix",
  date: "2026-05-24",
  time: "13:00:00Z",
  circuitName: "Circuit de Monaco",
  locality: "Monte Carlo",
  country: "Monaco",
  winner: {
    fullName: "Charles Leclerc",
    team: "Ferrari",
    nationality: "Monacan"
  }
};

export const mockNextRace: UpcomingRace = {
  season: "2026",
  round: "9",
  raceName: "Canadian Grand Prix",
  date: "2026-06-14",
  time: "18:00:00Z",
  circuitName: "Circuit Gilles Villeneuve",
  locality: "Montreal",
  country: "Canada"
};

export const mockCalendar: RaceWeekend[] = [
  {
    season: "2026",
    round: "9",
    raceName: "Canadian Grand Prix",
    date: "2026-06-14",
    time: "18:00:00Z",
    circuitName: "Circuit Gilles Villeneuve",
    locality: "Montreal",
    country: "Canada"
  },
  {
    season: "2026",
    round: "10",
    raceName: "Austrian Grand Prix",
    date: "2026-06-28",
    time: "13:00:00Z",
    circuitName: "Red Bull Ring",
    locality: "Spielberg",
    country: "Austria"
  },
  {
    season: "2026",
    round: "11",
    raceName: "British Grand Prix",
    date: "2026-07-05",
    time: "14:00:00Z",
    circuitName: "Silverstone Circuit",
    locality: "Silverstone",
    country: "United Kingdom"
  },
  {
    season: "2026",
    round: "12",
    raceName: "Hungarian Grand Prix",
    date: "2026-07-19",
    time: "13:00:00Z",
    circuitName: "Hungaroring",
    locality: "Mogyorod",
    country: "Hungary"
  },
  {
    season: "2026",
    round: "13",
    raceName: "Belgian Grand Prix",
    date: "2026-07-26",
    time: "13:00:00Z",
    circuitName: "Circuit de Spa-Francorchamps",
    locality: "Stavelot",
    country: "Belgium"
  }
];

export const mockTeams: TeamProfile[] = [
  {
    id: "red_bull",
    name: "Red Bull Racing",
    nationality: "Austrian",
    points: 350,
    wins: 8,
    position: 1,
    drivers: [
      { id: "max_verstappen", fullName: "Max Verstappen", code: "VER" },
      { id: "sergio_perez", fullName: "Sergio Perez", code: "PER" }
    ]
  },
  {
    id: "ferrari",
    name: "Ferrari",
    nationality: "Italian",
    points: 308,
    wins: 4,
    position: 2,
    drivers: [
      { id: "charles_leclerc", fullName: "Charles Leclerc", code: "LEC" },
      { id: "carlos_sainz", fullName: "Carlos Sainz", code: "SAI" }
    ]
  },
  {
    id: "mercedes",
    name: "Mercedes",
    nationality: "German",
    points: 281,
    wins: 1,
    position: 3,
    drivers: [
      { id: "george_russell", fullName: "George Russell", code: "RUS" },
      { id: "lewis_hamilton", fullName: "Lewis Hamilton", code: "HAM" }
    ]
  },
  {
    id: "mclaren",
    name: "McLaren",
    nationality: "British",
    points: 276,
    wins: 2,
    position: 4,
    drivers: [
      { id: "lando_norris", fullName: "Lando Norris", code: "NOR" },
      { id: "oscar_piastri", fullName: "Oscar Piastri", code: "PIA" }
    ]
  }
];
