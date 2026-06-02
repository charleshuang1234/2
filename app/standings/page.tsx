import { StandingsClient } from "@/components/standings/standings-client";
import { getF1DataProvider } from "@/lib/f1/service";

export default async function StandingsPage() {
  const provider = getF1DataProvider();
  const { standings, status } = await provider.getDriverStandings();
  return <StandingsClient standings={standings} status={status} />;
}
