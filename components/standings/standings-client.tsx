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
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const ordered = useMemo(() => [...standings].sort((a, b) => a.position - b.position), [standings]);
  const leaderPoints = ordered[0]?.points ?? 0;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-electric-blue">Driver Standings</h1>
          <p className="text-white/70">Live title race insights with neon head-to-head comparisons.</p>
        </div>
        <DataStatusBadge status={status} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Driver info cards">
        {ordered.map((driver, index) => {
          const isExpanded = expandedDriver === driver.id;
          const nextDriver = ordered[index + 1];
          const pointsBehindLeader = Math.max(0, leaderPoints - driver.points);
          const pointsAheadNext = nextDriver ? Math.max(0, driver.points - nextDriver.points) : 0;
          const fullName = `${driver.givenName} ${driver.familyName}`;

          return (
            <article
              key={driver.id}
              className="glass-panel group relative rounded-lg p-4 transition duration-200 hover:-translate-y-1 hover:border-electric-blue/70 hover:shadow-neonBlue"
              data-testid="driver-info-card"
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`driver-details-${driver.id}`}
                onClick={() => setExpandedDriver((current) => (current === driver.id ? null : driver.id))}
                className="focus-ring absolute inset-0 z-10 rounded-lg"
              >
                <span className="sr-only">
                  {isExpanded ? "Collapse" : "Expand"} {fullName} driver info
                </span>
              </button>

              <div className="pointer-events-none flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-electric-blue/60 bg-electric-blue/10 px-2 py-1 font-display text-xl text-electric-blue">
                      P{driver.position}
                    </span>
                    <span className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white/60">
                      {driver.code}
                    </span>
                  </div>
                  <h2 className="mt-4 break-words font-display text-2xl text-white">
                    {fullName}
                  </h2>
                  <p className="mt-1 break-words text-sm text-white/65">{driver.team}</p>
                </div>
                <span className="rounded-md border border-neon-red/50 bg-neon-red/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-neon-red">
                  {driver.nationality}
                </span>
              </div>

              <div className="pointer-events-none mt-4 grid grid-cols-2 gap-2">
                <span className="rounded-md border border-white/15 bg-black/30 px-3 py-2">
                  <span className="block text-xs uppercase tracking-wider text-white/50">Points</span>
                  <span className="font-display text-xl text-electric-blue">{driver.points}</span>
                </span>
                <span className="rounded-md border border-white/15 bg-black/30 px-3 py-2">
                  <span className="block text-xs uppercase tracking-wider text-white/50">Wins</span>
                  <span className="font-display text-xl text-signal-gold">{driver.wins}</span>
                </span>
              </div>

              {isExpanded ? (
                <div
                  id={`driver-details-${driver.id}`}
                  className="pointer-events-none mt-4 border-t border-white/10 pt-4 text-sm text-white/75"
                  data-testid="driver-expanded-details"
                >
                  <dl className="grid gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-white/50">Full name</dt>
                      <dd className="break-words text-right text-white">{fullName}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-white/50">Driver code</dt>
                      <dd className="font-semibold text-white">{driver.code}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-white/50">Championship</dt>
                      <dd className="font-semibold text-electric-blue">Position {driver.position}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-white/50">Leader gap</dt>
                      <dd className="text-white">
                        {pointsBehindLeader === 0 ? "Championship leader" : `${pointsBehindLeader} points behind`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-white/50">Next driver gap</dt>
                      <dd className="text-white">
                        {nextDriver ? `${pointsAheadNext} points ahead` : "Final listed driver"}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </article>
          );
        })}
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
