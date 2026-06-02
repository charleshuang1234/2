import { DriverStanding, HeadToHeadResult } from "@/lib/types";

export function buildHeadToHead(
  a: DriverStanding | undefined,
  b: DriverStanding | undefined
): HeadToHeadResult | null {
  if (!a || !b) {
    return null;
  }
  return {
    a: {
      points: a.points,
      wins: a.wins,
      position: a.position
    },
    b: {
      points: b.points,
      wins: b.wins,
      position: b.position
    },
    delta: {
      points: a.points - b.points,
      wins: a.wins - b.wins,
      position: b.position - a.position
    }
  };
}
