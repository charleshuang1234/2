"use client";

import { useMemo, useState } from "react";
import { DataStatusBadge } from "@/components/ui/data-status-badge";
import { DriverStanding, DataStatus } from "@/lib/types";
import { HeadToHead } from "@/components/standings/head-to-head";

type Props = {
  standings: DriverStanding[];
  status: DataStatus;
};

export function StandingsClient({ standings, status }: Props) {
  const [driverA, setDriverA] = useState<string>(standings[0]?.id ?? "");
  const [driverB, setDriverB] = useState<string>(standings[1]?.id ?? "");
  const ordered = useMemo(() => [...standings].sort((a, b) => a.position - b.position), [standings]);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-electric-blue">Driver Standings</h1>
          <p className="text-white/70">Live title race insights with neon head-to-head comparisons.</p>
        </div>
        <DataStatusBadge status={status} />
      </section>

      <section className="glass-panel overflow-x-auto rounded-lg">
        <table className="w-full min-w-[640px] text-left">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/60">
            <tr>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Wins</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((driver) => (
              <tr key={driver.id} className="border-b border-white/5 text-white/85">
                <td className="px-4 py-3 font-display text-electric-blue">{driver.position}</td>
                <td className="px-4 py-3">
                  {driver.givenName} {driver.familyName}{" "}
                  <span className="text-xs text-white/55">({driver.code})</span>
                </td>
                <td className="px-4 py-3 text-white/70">{driver.team}</td>
                <td className="px-4 py-3">{driver.points}</td>
                <td className="px-4 py-3">{driver.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="glass-panel rounded-lg p-5">
        <h2 className="font-display text-3xl text-neon-red">Head-to-Head Comparison</h2>
        <p className="mt-2 text-white/70">Select any two drivers and compare points, wins, and championship position at a glance.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-white/60">Driver A</span>
            <select
              value={driverA}
              onChange={(event) => setDriverA(event.target.value)}
              className="focus-ring w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-white"
            >
              {ordered.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.givenName} {driver.familyName}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-white/60">Driver B</span>
            <select
              value={driverB}
              onChange={(event) => setDriverB(event.target.value)}
              className="focus-ring w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-white"
            >
              {ordered.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.givenName} {driver.familyName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4">
          <HeadToHead driverA={driverA} driverB={driverB} standings={ordered} />
        </div>
      </section>
    </div>
  );
}
