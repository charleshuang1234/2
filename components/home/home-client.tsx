"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DataStatusBadge } from "@/components/ui/data-status-badge";
import { DataStatus, RaceResult, UpcomingRace } from "@/lib/types";
import { formatRaceDate } from "@/lib/utils";
import { useAdaptiveMotion } from "@/components/hooks/use-adaptive-motion";

type Props = {
  latestResult: RaceResult;
  nextRace: UpcomingRace;
  status: DataStatus;
};

function computeCountdown(date: string, time?: string) {
  const targetIso = time ? `${date}T${time.replace("Z", "")}Z` : `${date}T00:00:00Z`;
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, mins };
}

const featureBlocks = [
  {
    title: "Live Stats",
    copy: "Track the latest race outcomes, standings swings, and momentum shifts as the season unfolds."
  },
  {
    title: "Custom Cars",
    copy: "Engineer your own contender with power-unit and aero combinations and see instant performance impact."
  },
  {
    title: "Interactive",
    copy: "Compare title rivals head-to-head and inspect race calendar and team profiles in one connected flow."
  }
];

export function HomeClient({ latestResult, nextRace, status }: Props) {
  const { shouldReduce } = useAdaptiveMotion();
  const [countdown, setCountdown] = useState(() => computeCountdown(nextRace.date, nextRace.time));
  const { scrollYProgress } = useScroll();
  const parallaxA = useTransform(scrollYProgress, [0, 1], [0, shouldReduce ? -45 : -120]);
  const parallaxB = useTransform(scrollYProgress, [0, 1], [0, shouldReduce ? -70 : -200]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(computeCountdown(nextRace.date, nextRace.time));
    }, 60_000);
    return () => clearInterval(timer);
  }, [nextRace.date, nextRace.time]);

  const winnerHeadline = useMemo(
    () => `${latestResult.winner.fullName} won ${latestResult.raceName}`,
    [latestResult]
  );

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-lg border border-white/10 px-6 py-16 sm:px-10">
        <motion.div
          style={{ y: parallaxA }}
          className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-electric-blue/20 blur-3xl"
        />
        <motion.div
          style={{ y: parallaxB }}
          className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-neon-red/20 blur-3xl"
        />
        <div className="relative z-10 max-w-3xl space-y-5">
          <DataStatusBadge status={status} />
          <p className="font-display text-sm uppercase tracking-[0.35em] text-white/70">F1 Pulse</p>
          <h1 className="neon-title font-display text-5xl leading-none sm:text-7xl">PUSH THE LIMITS</h1>
          <p className="max-w-xl text-lg text-white/80">
            Real-time Formula 1 data, creative telemetry visuals, and interactive race intelligence in one high-energy experience.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass-panel rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-electric-blue">Latest Grand Prix</p>
          <h2 className="mt-2 text-2xl font-semibold">{winnerHeadline}</h2>
          <p className="mt-2 text-white/75">
            {latestResult.circuitName} - {latestResult.locality}, {latestResult.country}
          </p>
          <p className="mt-2 text-sm text-white/65">{formatRaceDate(latestResult.date, latestResult.time)}</p>
        </article>
        <article className="glass-panel rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-neon-red">Next Race Countdown</p>
          <h2 className="mt-2 text-2xl font-semibold">{nextRace.raceName}</h2>
          <p className="mt-2 text-white/75">
            {nextRace.circuitName} - {nextRace.locality}, {nextRace.country}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-white/15 bg-black/20 p-3">
              <p className="font-display text-3xl text-electric-blue">{countdown.days}</p>
              <p className="text-xs uppercase text-white/60">Days</p>
            </div>
            <div className="rounded-md border border-white/15 bg-black/20 p-3">
              <p className="font-display text-3xl text-electric-blue">{countdown.hours}</p>
              <p className="text-xs uppercase text-white/60">Hours</p>
            </div>
            <div className="rounded-md border border-white/15 bg-black/20 p-3">
              <p className="font-display text-3xl text-electric-blue">{countdown.mins}</p>
              <p className="text-xs uppercase text-white/60">Min</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureBlocks.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="glass-panel rounded-lg p-5"
          >
            <h3 className="font-display text-2xl text-electric-blue">{feature.title}</h3>
            <p className="mt-3 text-white/80">{feature.copy}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
