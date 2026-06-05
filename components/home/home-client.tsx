"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DataStatusBadge } from "@/components/ui/data-status-badge";
import { DataStatus, DriverStanding, RaceResult, UpcomingRace } from "@/lib/types";
import { formatRaceDate } from "@/lib/utils";
import { useAdaptiveMotion } from "@/components/hooks/use-adaptive-motion";

type Props = {
  latestResult: RaceResult;
  nextRace: UpcomingRace;
  standings: DriverStanding[];
  status: DataStatus;
};

const FAVORITES_KEY = "f1-pulse-favorite-drivers";

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

function getRaceDate(date: string, time?: string) {
  const iso = time ? `${date}T${time.replace("Z", "")}Z` : `${date}T00:00:00Z`;
  return new Date(iso);
}

const featureBlocks = [
  {
    title: "Live Stats",
    href: "/standings",
    copy: "Track the latest race outcomes, standings swings, and momentum shifts as the season unfolds."
  },
  {
    title: "Custom Cars",
    href: "/builder",
    copy: "Engineer your own contender with power-unit and aero combinations and see instant performance impact."
  },
  {
    title: "Interactive",
    href: "/calendar",
    copy: "Compare title rivals head-to-head and inspect race calendar and team profiles in one connected flow."
  }
];

const constructorColors: Array<{ match: string; color: string; text: string }> = [
  { match: "mercedes", color: "#00D2BE", text: "#041312" },
  { match: "ferrari", color: "#DC0000", text: "#ffffff" },
  { match: "red bull", color: "#3671C6", text: "#ffffff" },
  { match: "mclaren", color: "#FF8000", text: "#0d0801" },
  { match: "aston martin", color: "#006F44", text: "#ffffff" },
  { match: "alpine", color: "#0093CC", text: "#ffffff" },
  { match: "williams", color: "#005AFF", text: "#ffffff" },
  { match: "haas", color: "#B6BABD", text: "#05070f" },
  { match: "sauber", color: "#52E252", text: "#041312" },
  { match: "kick", color: "#52E252", text: "#041312" },
  { match: "racing bulls", color: "#6692FF", text: "#05070f" }
];

function getConstructorColor(team: string) {
  const normalized = team.toLowerCase();
  return constructorColors.find((entry) => normalized.includes(entry.match)) ?? {
    color: "#FFFFFF",
    text: "rgba(255,255,255,0.78)"
  };
}

function formatLocalRaceTime(date: string, timeZone: string, time?: string) {
  const iso = time ? `${date}T${time.replace("Z", "")}Z` : `${date}T00:00:00Z`;
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    timeZoneName: "shortOffset"
  });
  const parts = formatter.formatToParts(new Date(iso));
  const zoneName = parts.find((part) => part.type === "timeZoneName")?.value;
  const dateTime = parts
    .filter((part) => part.type !== "timeZoneName")
    .map((part) => part.value)
    .join("")
    .trim()
    .replace(/,\s*$/, "");
  return zoneName ? `${dateTime} · ${zoneName}` : dateTime;
}

export function HomeClient({ latestResult, nextRace, standings, status }: Props) {
  const { shouldReduce } = useAdaptiveMotion();
  const [countdown, setCountdown] = useState(() => computeCountdown(nextRace.date, nextRace.time));
  const [favoriteDriverIds, setFavoriteDriverIds] = useState<string[]>([]);
  const [reminderStatus, setReminderStatus] = useState("Race reminder");
  const { scrollYProgress } = useScroll();
  const parallaxA = useTransform(scrollYProgress, [0, 1], [0, shouldReduce ? -45 : -120]);
  const parallaxB = useTransform(scrollYProgress, [0, 1], [0, shouldReduce ? -70 : -200]);
  const [raceTimeLabel, setRaceTimeLabel] = useState(() => formatRaceDate(nextRace.date, nextRace.time));
  const topDrivers = useMemo(
    () => [...standings].sort((a, b) => a.position - b.position).slice(0, 3),
    [standings]
  );
  const favoriteDrivers = useMemo(
    () => standings.filter((driver) => favoriteDriverIds.includes(driver.id)).sort((a, b) => a.position - b.position),
    [favoriteDriverIds, standings]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(computeCountdown(nextRace.date, nextRace.time));
    }, 60_000);
    return () => clearInterval(timer);
  }, [nextRace.date, nextRace.time]);

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setRaceTimeLabel(formatLocalRaceTime(nextRace.date, timeZone, nextRace.time));
  }, [nextRace.date, nextRace.time]);

  useEffect(() => {
    const cached = localStorage.getItem(FAVORITES_KEY);
    if (!cached) return;

    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        setFavoriteDriverIds(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      localStorage.removeItem(FAVORITES_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteDriverIds));
  }, [favoriteDriverIds]);

  const winnerHeadline = useMemo(
    () => `${latestResult.winner.fullName} won ${latestResult.raceName}`,
    [latestResult]
  );

  function toggleFavorite(driverId: string) {
    setFavoriteDriverIds((current) =>
      current.includes(driverId) ? current.filter((id) => id !== driverId) : [...current, driverId]
    );
  }

  async function scheduleRaceReminder() {
    if (!("Notification" in window)) {
      setReminderStatus("Notifications unavailable");
      return;
    }

    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    if (permission !== "granted") {
      setReminderStatus("Notifications blocked");
      return;
    }

    const reminderTime = getRaceDate(nextRace.date, nextRace.time).getTime() - 15 * 60 * 1000;
    const delay = reminderTime - Date.now();
    if (delay <= 0) {
      new Notification("F1 Pulse", {
        body: `${nextRace.raceName} is close. Time to open race mode.`
      });
      setReminderStatus("Reminder sent");
      return;
    }

    window.setTimeout(() => {
      new Notification("F1 Pulse", {
        body: `${nextRace.raceName} starts in 15 minutes.`
      });
    }, delay);
    setReminderStatus("Reminder armed");
  }

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
            {latestResult.circuitName} · {latestResult.locality}, {latestResult.country}
          </p>
          <p className="mt-2 text-sm text-white/65">{formatRaceDate(latestResult.date, latestResult.time)}</p>
        </article>
        <article className="glass-panel rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-neon-red">Race starts in</p>
          <h2 className="mt-2 text-2xl font-semibold">{nextRace.raceName}</h2>
          <p className="mt-2 text-white/75">
            {nextRace.circuitName} · {nextRace.locality}, {nextRace.country}
          </p>
          <p className="mt-2 text-sm text-white/65">{raceTimeLabel}</p>
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

      <section className="glass-panel rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-signal-gold">Championship pulse</p>
            <h2 className="mt-1 font-display text-2xl text-electric-blue">Top 3 Drivers</h2>
          </div>
          <Link href="/standings" className="focus-ring rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition hover:border-electric-blue/60 hover:text-electric-blue">
            Full standings →
          </Link>
        </div>
        <div className="mt-4 rounded-md border border-electric-blue/25 bg-electric-blue/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-electric-blue">My Pulse</p>
              <h3 className="font-display text-xl text-white">
                {favoriteDrivers.length ? "Following your title fight" : "Follow drivers for a personal feed"}
              </h3>
            </div>
            <button
              type="button"
              onClick={scheduleRaceReminder}
              className="focus-ring min-h-11 rounded-md border border-neon-red/45 bg-neon-red/10 px-3 py-2 text-sm font-semibold text-neon-red transition hover:border-neon-red hover:bg-neon-red/15"
            >
              {reminderStatus}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(favoriteDrivers.length ? favoriteDrivers : topDrivers).map((driver) => (
              <button
                key={driver.id}
                type="button"
                onClick={() => toggleFavorite(driver.id)}
                aria-pressed={favoriteDriverIds.includes(driver.id)}
                className="focus-ring min-h-11 rounded-md border border-white/15 bg-black/25 px-3 py-2 text-left text-sm text-white/75 transition hover:border-electric-blue/60 hover:text-electric-blue"
              >
                <span className="font-display text-electric-blue">P{driver.position}</span>{" "}
                {driver.givenName} {driver.familyName}
                <span className="ml-2 text-white/45">{favoriteDriverIds.includes(driver.id) ? "Following" : "Follow"}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {topDrivers.map((driver) => {
            const teamColor = getConstructorColor(driver.team);
            return (
              <article key={driver.id} className="rounded-md border border-white/15 bg-black/25 p-4 transition duration-200 hover:scale-[1.02] hover:border-electric-blue/70 hover:shadow-neonBlue">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-xl text-electric-blue">P{driver.position}</p>
                  <p
                    className="rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: teamColor.color,
                      backgroundColor: `${teamColor.color}26`,
                      color: teamColor.text,
                      boxShadow: `0 0 14px ${teamColor.color}55`
                    }}
                  >
                    {driver.code}
                  </p>
                </div>
                <h3 className="mt-3 break-words font-display text-xl text-white">
                  {driver.givenName} {driver.familyName}
                </h3>
                <p className="mt-1 break-words text-sm text-white/65">{driver.team}</p>
                <p className="mt-3 text-sm text-white/75">
                  <span className="font-display text-lg text-signal-gold">{driver.points}</span> pts · {driver.wins} wins
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureBlocks.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <Link
              href={feature.href}
              className="focus-ring glass-panel group relative block h-full rounded-lg p-5 pr-14 transition duration-200 hover:scale-[1.02] hover:border-electric-blue/70 hover:shadow-neonBlue"
            >
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-electric-blue/35 bg-electric-blue/10 font-display text-lg text-electric-blue transition group-hover:border-electric-blue/75 group-hover:bg-electric-blue/20"
              >
                →
              </span>
              <h3 className="font-display text-2xl text-electric-blue">{feature.title}</h3>
              <p className="mt-3 text-white/80">{feature.copy}</p>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
