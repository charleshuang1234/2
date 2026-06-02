"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DataStatusBadge } from "@/components/ui/data-status-badge";
import { DataStatus, RaceWeekend, TeamProfile } from "@/lib/types";
import { formatRaceDate } from "@/lib/utils";
import { useAdaptiveMotion } from "@/components/hooks/use-adaptive-motion";

type Props = {
  races: RaceWeekend[];
  teams: TeamProfile[];
  status: DataStatus;
};

export function CalendarClient({ races, teams, status }: Props) {
  const { shouldReduce } = useAdaptiveMotion();
  const [openTeamId, setOpenTeamId] = useState<string>(teams[0]?.id ?? "");

  return (
    <div className="space-y-7">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-electric-blue">Race Calendar</h1>
          <p className="text-white/70">Full season schedule with team portals and driver lineups.</p>
        </div>
        <DataStatusBadge status={status} />
      </section>

      <section className="glass-panel rounded-lg p-5">
        <h2 className="font-display text-2xl text-neon-red">Season Schedule</h2>
        <div className="mt-4 grid gap-3">
          {races.map((race, index) => (
            <motion.article
              key={`${race.season}-${race.round}`}
              initial={shouldReduce ? undefined : { opacity: 0, x: -15 }}
              whileInView={shouldReduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="rounded-md border border-white/15 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xl text-electric-blue">
                  R{race.round} - {race.raceName}
                </p>
                <p className="text-sm text-white/70">{formatRaceDate(race.date, race.time)}</p>
              </div>
              <p className="text-sm text-white/65">
                {race.circuitName} - {race.locality}, {race.country}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-lg p-5">
        <h2 className="font-display text-2xl text-electric-blue">Team Portals</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {teams.map((team) => {
            const open = openTeamId === team.id;
            return (
              <button
                key={team.id}
                type="button"
                onClick={() => setOpenTeamId(open ? "" : team.id)}
                className="focus-ring rounded-md border border-white/15 bg-black/25 p-4 text-left transition hover:border-electric-blue/40"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl text-neon-red">{team.name}</p>
                  <p className="text-sm text-white/60">P{team.position}</p>
                </div>
                <p className="mt-1 text-sm text-white/70">
                  {team.points} pts - {team.wins} wins
                </p>
                {open && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-xs uppercase tracking-wider text-white/60">Driver Lineup</p>
                    <ul className="mt-2 space-y-1 text-sm text-white/85">
                      {team.drivers.map((driver) => (
                        <li key={driver.id}>
                          {driver.fullName} <span className="text-white/55">({driver.code})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
