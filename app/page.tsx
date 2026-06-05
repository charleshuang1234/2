import { HomeClient } from "@/components/home/home-client";
import { getF1DataProvider } from "@/lib/f1/service";
import { DataStatus } from "@/lib/types";

function mergeStatus(...statuses: DataStatus[]): DataStatus {
  if (statuses.some((item) => item.state === "fallback")) {
    return statuses.find((item) => item.state === "fallback") as DataStatus;
  }
  if (statuses.some((item) => item.state === "stale")) {
    return statuses.find((item) => item.state === "stale") as DataStatus;
  }
  return statuses[0];
}

export default async function HomePage() {
  const provider = getF1DataProvider();
  const [latestResultData, nextRaceData, standingsData] = await Promise.all([
    provider.getLatestResult(),
    provider.getNextRace(),
    provider.getDriverStandings()
  ]);
  const status = mergeStatus(latestResultData.status, nextRaceData.status, standingsData.status);

  return (
    <HomeClient
      latestResult={latestResultData.result}
      nextRace={nextRaceData.race}
      standings={standingsData.standings}
      status={status}
    />
  );
}
