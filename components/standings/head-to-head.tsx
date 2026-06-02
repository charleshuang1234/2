"use client";

import { DriverStanding } from "@/lib/types";
import { buildHeadToHead } from "@/lib/standings/head-to-head";

function ProgressBar({
  label,
  value,
  maxValue,
  accent
}: {
  label: string;
  value: number;
  maxValue: number;
  accent: "blue" | "red";
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(maxValue, 1)) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-white/70">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          aria-label={`${label} progress`}
          className={accent === "blue" ? "h-full bg-electric-blue" : "h-full bg-neon-red"}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function HeadToHead({
  driverA,
  driverB,
  standings
}: {
  driverA: string;
  driverB: string;
  standings: DriverStanding[];
}) {
  const driverAData = standings.find((driver) => driver.id === driverA);
  const driverBData = standings.find((driver) => driver.id === driverB);
  const comparison = buildHeadToHead(driverAData, driverBData);
  if (!comparison || !driverAData || !driverBData) {
    return (
      <div className="rounded-md border border-white/15 bg-black/20 p-4 text-sm text-white/70">
        Select two drivers to compare title-fight metrics.
      </div>
    );
  }
  const maxPoints = Math.max(comparison.a.points, comparison.b.points);
  const maxWins = Math.max(comparison.a.wins, comparison.b.wins, 1);
  const maxPosition = Math.max(comparison.a.position, comparison.b.position);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-md border border-electric-blue/35 bg-electric-blue/5 p-4">
        <h3 className="font-display text-xl text-electric-blue">
          {driverAData.givenName} {driverAData.familyName}
        </h3>
        <p className="text-sm text-white/70">{driverAData.team}</p>
        <div className="mt-4 space-y-3">
          <ProgressBar label="Points" value={comparison.a.points} maxValue={maxPoints} accent="blue" />
          <ProgressBar label="Wins" value={comparison.a.wins} maxValue={maxWins} accent="blue" />
          <ProgressBar
            label="Champ Position"
            value={maxPosition - comparison.a.position + 1}
            maxValue={maxPosition}
            accent="blue"
          />
        </div>
      </article>
      <article className="rounded-md border border-neon-red/35 bg-neon-red/5 p-4">
        <h3 className="font-display text-xl text-neon-red">
          {driverBData.givenName} {driverBData.familyName}
        </h3>
        <p className="text-sm text-white/70">{driverBData.team}</p>
        <div className="mt-4 space-y-3">
          <ProgressBar label="Points" value={comparison.b.points} maxValue={maxPoints} accent="red" />
          <ProgressBar label="Wins" value={comparison.b.wins} maxValue={maxWins} accent="red" />
          <ProgressBar
            label="Champ Position"
            value={maxPosition - comparison.b.position + 1}
            maxValue={maxPosition}
            accent="red"
          />
        </div>
      </article>
      <p className="col-span-full rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white/75">
        Delta: {comparison.delta.points > 0 ? "+" : ""}
        {comparison.delta.points} points, {comparison.delta.wins > 0 ? "+" : ""}
        {comparison.delta.wins} wins, {comparison.delta.position > 0 ? "+" : ""}
        {comparison.delta.position} position swing for Driver A.
      </p>
    </div>
  );
}
