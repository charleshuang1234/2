import { CalendarClient } from "@/components/calendar/calendar-client";
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

export default async function CalendarPage() {
  const provider = getF1DataProvider();
  const [calendarData, teamData] = await Promise.all([provider.getRaceCalendar(), provider.getTeams()]);
  return (
    <CalendarClient
      races={calendarData.races}
      teams={teamData.teams}
      status={mergeStatus(calendarData.status, teamData.status)}
    />
  );
}
