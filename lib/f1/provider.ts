import {
  DataStatus,
  DriverStanding,
  RaceResult,
  RaceWeekend,
  TeamProfile,
  UpcomingRace
} from "@/lib/types";

export interface F1DataProvider {
  getLatestResult(): Promise<{ result: RaceResult; status: DataStatus }>;
  getNextRace(): Promise<{ race: UpcomingRace; status: DataStatus }>;
  getDriverStandings(season?: string): Promise<{
    standings: DriverStanding[];
    status: DataStatus;
  }>;
  getRaceCalendar(season?: string): Promise<{
    races: RaceWeekend[];
    status: DataStatus;
  }>;
  getTeams(season?: string): Promise<{
    teams: TeamProfile[];
    status: DataStatus;
  }>;
}
